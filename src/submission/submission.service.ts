import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './submission.entity';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { MediaService } from 'src/media/media.service';
import { IgApiClient } from 'instagram-private-api';
import { SubmissionStatuses } from './submission.interface';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
    private mediaService: MediaService,
  ) {}

  findById(submissionId: string): Promise<Submission> {
    return this.submissionRepo.findOne(submissionId, {
      relations: ['user', 'media'],
    });
  }

  findAllByUserId(userId: string): Promise<Submission[]> {
    return this.submissionRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['media'],
    });
  }

  delete(id: string): Promise<DeleteResult> {
    return this.submissionRepo.delete(id);
  }

  async update(id: string, submission: Submission): Promise<UpdateResult> {
    return this.submissionRepo.update(id, submission);
  }

  async create(submission: Submission): Promise<Submission> {
    const existingSubmission = await this.submissionRepo.findOne({
      where: {
        media: {
          id: submission.media.id,
        },
      },
    });
    if (existingSubmission)
      throw new ConflictException('Submission for this media already exists.');

    if (!submission.attributionUsername)
      submission.attributionUsername = submission.media.authorUsername;

    return this.submissionRepo.save(submission);
  }

  async upload(submissionId: string) {
    const submission: Submission = await this.submissionRepo.findOne(
      submissionId,
      {
        relations: ['media', 'user'],
      },
    );
    if (!submission) throw new NotFoundException('Submission not found');

    const {
      media: { id: mediaId },
      attributionUsername,
      caption,
      user: { instagramUsername, instagramPassword },
    } = submission;

    try {
      const submissionBuffers = this.mediaService.getSubmissionMediaBuffers(
        mediaId,
        attributionUsername,
      );

      const ig = new IgApiClient();
      ig.state.generateDevice(instagramUsername);
      await ig.account
        .login(instagramUsername, instagramPassword)
        .catch(err => {
          throw new ForbiddenException(`Instagram login failed. ${err}`);
        });
      ig.simulate.postLoginFlow();

      const [videoBuffer, thumbnailBuffer] = await submissionBuffers;

      await ig.publish.video({
        video: videoBuffer,
        coverImage: thumbnailBuffer,
        caption: caption,
      });

      submission.publishedAt = new Date();
      submission.status = SubmissionStatuses.PUBLISHED;

      await ig.account.logout();

      this.submissionRepo.save(submission);
    } catch (err) {
      submission.status = SubmissionStatuses.FAILED
      submission.meta = err.toString()
      this.submissionRepo.save(submission);
    }
  }
}
