import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { createApi } from 'instamancer';
import { FeedFilter } from 'src/feed-filter/feed-filter.entity';
import { Media, MediaTypes, MediaVisibilityStatuses } from './media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueryOptionsInterface } from 'src/interfaces';
import Axios from 'axios';
import {
  createWriteStream,
  unlinkSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
} from 'fs';
import { resolve } from 'path';
import watermark from 'src/lib/canvas';
import { FeedFilterTypes } from 'src/feed-filter/feed-filter.interface';

import ffmpeg = require('ffmpeg');

@Injectable()
export class MediaService {
  constructor(@InjectRepository(Media) private mediaRepo: Repository<Media>) {}

  findAll(): Promise<Media[]> {
    return this.mediaRepo.find();
  }

  findOne(mediaId: string): Promise<Media> {
    return this.mediaRepo
      .createQueryBuilder('media')
      .leftJoinAndSelect('media.submission', 'submission')
      .innerJoinAndSelect('media.filter', 'filter')
      .innerJoinAndSelect('filter.user', 'user')
      .select([
        'media',
        'filter.id',
        'filter.value',
        'filter.type',
        'user',
        'submission.id',
        'submission.scheduledFor',
      ])
      .where('media.id = :mediaId', { mediaId })
      .orderBy('media.visibilityStatus', 'DESC')
      .getOne();
  }

  async markSeen(mediaId: string): Promise<Media> {
    await this.mediaRepo.update(mediaId, {
      visibilityStatus: MediaVisibilityStatuses.SEEN,
    });

    return this.mediaRepo.findOne(mediaId);
  }

  async toggleFavourite(mediaId: string): Promise<Media> {
    const media = await this.mediaRepo.findOne(mediaId);

    media.favourite = !media.favourite;

    return this.mediaRepo.save(media);
  }

  async getMedia(
    userId: string,
    query?: QueryOptionsInterface,
  ): Promise<Media[]> {
    const take = Number(query?.pageSize) || 10;
    const skip = Number(query?.pageSize * (query?.pageNum - 1)) || 0;

    return this.mediaRepo
      .createQueryBuilder('media')
      .leftJoinAndSelect('media.submission', 'submission')
      .innerJoinAndSelect('media.filter', 'filter')
      .innerJoinAndSelect('filter.user', 'user')
      .select([
        'media',
        'filter.id',
        'filter.value',
        'filter.type',
        'submission.id',
        'submission.scheduledFor',
      ])
      .where('user.id = :userId', { userId })
      .orderBy('media.visibilityStatus', 'DESC')
      .take(take)
      .skip(skip)
      .getMany();
  }

  async getMediaForFilter(
    feedFilterId: string,
    query?: QueryOptionsInterface,
  ): Promise<Media[]> {
    const take = Number(query?.pageSize) || 10;
    const skip = Number(query?.pageSize * (query?.pageNum - 1)) || 0;

    return this.mediaRepo
      .createQueryBuilder('media')
      .leftJoinAndSelect('media.submission', 'submission')
      .leftJoinAndSelect('media.filter', 'filter')
      .select([
        'media',
        'filter.id',
        'filter.value',
        'filter.type',
        'submission.id',
        'submission.scheduledFor',
      ])
      .where('filterId = :feedFilterId', { feedFilterId })
      .orderBy('media.visibilityStatus', 'DESC')
      .take(take)
      .skip(skip)
      .getMany();
  }

  async getMediaVideoUrl(videoHash: string): Promise<string> {
    const response = await Axios({
      method: 'GET',
      url: `https://www.instagram.com/tv/${videoHash}/embed/`,
      responseType: 'text',
    });

    const getUrlForKey = key => {
      const [_, encodedVideoUrl] = response.data.match(
        new RegExp(`"${key}":"(.*?)"`),
      );
      const decodedUrl = decodeURIComponent(
        JSON.parse('"' + encodedVideoUrl + '"'),
      );
      return decodedUrl;
    };

    return getUrlForKey('video_url');
  }

  async scrapeMediaForFilter(feedFilter: FeedFilter) {
    if (feedFilter.type !== FeedFilterTypes.HASHTAG)
      throw new HttpException('Only hashtag filters are supported.', 400);

    const hashtag = createApi('hashtag', feedFilter.value, {
      fullAPI: true,
    });

    console.log('hashtag: ', hashtag);

    const posts = [];

    for await (const node of hashtag.generator()) {
      console.log(
        'node.shortcode_media.is_video: ',
        node.shortcode_media.is_video,
      );
      if (!node.shortcode_media.is_video) continue;

      const post = node.shortcode_media;
      console.log('post: ', post.shortcode);

      const alreadyExists = await this.mediaRepo.findOne({
        where: {
          type: MediaTypes.VIDEO,
          videoHash: post.shortcode,
        },
      });

      console.log('alreadyExists: ', alreadyExists);
      if (alreadyExists) continue;

      const media: Media = {
        postUrl: `https://www.instagram.com/p/${post.shortcode}/`,
        videoHash: post.shortcode,
        authorUsername: post.owner.username,
        originalCaption: post.edge_media_to_caption.edges[0].node.text,
        viewCount: post.video_view_count,
        commentCount: post.edge_media_preview_comment.count,
        likesCount: post.edge_media_preview_like.count,
        duration: post.video_duration,
        filter: feedFilter,
      };

      console.log('media: ', media);

      const savedMedia = await this.mediaRepo.save(media);

      posts.push(savedMedia);

      if (posts.length === 10) break;
    }

    return posts;
  }

  async getSubmissionMediaBuffers(
    mediaId,
    attributionUsername?: string,
  ): Promise<[Buffer, Buffer]> {
    const media = await this.findOne(mediaId);
    if (!media)
      throw new HttpException('mediaId does not exist.', HttpStatus.NOT_FOUND);

    const { id, videoHash } = media;

    const videoUrl = await this.getMediaVideoUrl(videoHash);

    const response = await Axios({
      method: 'GET',
      url: videoUrl,
      responseType: 'stream',
    });

    const { 'content-type': contentType } = response.headers;

    const mediaRoot = resolve(__dirname, '..', 'temp_media');

    if (!existsSync(mediaRoot)) {
      mkdirSync(mediaRoot);
    }

    const videoPath = resolve(
      mediaRoot,
      `${id}_base.${contentType.split('/')[1]}`,
    );

    response.data.pipe(createWriteStream(videoPath));

    await new Promise((resolve, reject) => {
      response.data.on('end', () => resolve());
      response.data.on('error', err => reject(err));
    });

    const watermarkBuffer = await watermark.getWatermarkBuffer(
      attributionUsername || media.authorUsername,
    );

    const watermarkPath = resolve(mediaRoot, `${id}.png`);
    writeFileSync(watermarkPath, watermarkBuffer);

    const destinationPath = resolve(
      mediaRoot,
      `${id}.${contentType.split('/')[1]}`,
    );

    const ffVideo = await ffmpeg(videoPath);

    await new Promise(resolve => {
      ffVideo.fnAddWatermark(
        watermarkPath,
        destinationPath,
        {
          position: 'SE',
        },
        (err, file) => resolve(file),
      );
    });

    const thumbnailFilePath = resolve(mediaRoot, `${id}.jpg`);

    await new Promise(resolve => {
      ffVideo.addCommand('-ss', `${ffVideo.metadata.duration.seconds / 2}`);
      ffVideo.addCommand('-vframes', '1');
      ffVideo.save(thumbnailFilePath, resolve);
    });

    const videoBuffer = readFileSync(destinationPath);
    const thumbnailBuffer = readFileSync(thumbnailFilePath);

    unlinkSync(videoPath);
    unlinkSync(watermarkPath);
    unlinkSync(thumbnailFilePath);
    unlinkSync(destinationPath);

    return [videoBuffer, thumbnailBuffer];
  }
}
