import {
  Controller,
  Get,
  Put,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { Media } from './media.entity';
import { Auth } from 'src/decorators/auth.decorator';
import { DUser } from 'src/decorators/user.decorator';
import { User } from 'src/user/user.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VideoUrlDto } from './dtos/video-url.dto';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Get(':mediaId')
  @Auth()
  @ApiOperation({ summary: 'Get media by ID.' })
  async getMedia(
    @DUser() user: User,
    @Param('mediaId') mediaId: string,
  ): Promise<Media> {
    const media = await this.mediaService.findOne(mediaId);

    if (!media)
      throw new HttpException('Media does not exist.', HttpStatus.NOT_FOUND);
    if (media.filter.user.id !== user.id)
      throw new HttpException('', HttpStatus.FORBIDDEN);

    return media;
  }

  @Get(':mediaId/uri')
  @Auth()
  @ApiOperation({ summary: 'Get the URI for the media-type, video or image.' })
  async getMediaUri(
    @DUser() user: User,
    @Param('mediaId') mediaId: string,
  ): Promise<VideoUrlDto> {
    const media = await this.mediaService.findOne(mediaId);

    if (!media)
      throw new HttpException('Media does not exist.', HttpStatus.NOT_FOUND);
    if (media.filter.user.id !== user.id)
      throw new HttpException('', HttpStatus.FORBIDDEN);

    const videoUrl = await this.mediaService.getMediaVideoUrl(media.videoHash);

    return {
      videoUrl,
    };
  }

  @Put(':mediaId/seen')
  @Auth()
  @ApiOperation({ summary: 'Mark media as seen.' })
  async markSeen(
    @DUser() user: User,
    @Param('mediaId') mediaId: string,
  ): Promise<Media> {
    const media = await this.mediaService.findOne(mediaId);

    if (!media)
      throw new HttpException('Media does not exist.', HttpStatus.NOT_FOUND);
    if (media.filter.user.id !== user.id)
      throw new HttpException('', HttpStatus.FORBIDDEN);

    return this.mediaService.markSeen(mediaId);
  }

  @Put(':mediaId/favourite')
  @Auth()
  @ApiOperation({ summary: 'Toggle media as as favourite.' })
  async toggleFavourite(
    @DUser() user: User,
    @Param('mediaId') mediaId: string,
  ): Promise<Media> {
    const media = await this.mediaService.findOne(mediaId);

    if (!media)
      throw new HttpException('Media does not exist.', HttpStatus.NOT_FOUND);
    if (media.filter.user.id !== user.id)
      throw new HttpException('', HttpStatus.FORBIDDEN);

    return this.mediaService.toggleFavourite(mediaId);
  }
}
