import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FeedFilterService } from 'src/feed-filter/feed-filter.service';
import { MediaService } from 'src/media/media.service';
import { Media } from 'src/media/media.entity';
import { DUser } from 'src/decorators/user.decorator';
import { User } from 'src/user/user.entity';
import { Auth } from 'src/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { QueryOptionsInterface } from 'src/interfaces';

@ApiTags('Feed')
@Controller('feed')
export class FeedController {
  constructor(
    private mediaService: MediaService,
    private feedFilterService: FeedFilterService,
  ) {}

  @Get()
  @Auth()
  getFeed(@DUser() user: User, @Query() pagingOptions: QueryOptionsInterface): Promise<Media[]> {
    return this.mediaService.getMedia(user.id, pagingOptions)
  }

  @Get('filter/:filterId')
  @Auth()
  async getFeedForFilter(
    @DUser() user: User,
    @Param('filterId') filterId: string,
    @Query() pagingOptions: QueryOptionsInterface,
  ): Promise<Media[]> {
    const feedFilter = await this.feedFilterService.findById(filterId);

    if (!feedFilter)
      throw new HttpException('Feed Filter does not exist.', 404);
    if (feedFilter.user.id !== user.id)
      throw new HttpException('', HttpStatus.FORBIDDEN);

    return this.mediaService.getMediaForFilter(feedFilter.id, pagingOptions);
  }

  @Get('filter/:filterId/refresh')
  @Auth()
  async refreshAndGetFeedForFilter(
    @DUser() user: User,
    @Param('filterId') filterId: string,
  ): Promise<Media[]> {
    const feedFilter = await this.feedFilterService.findById(filterId);

    if (!feedFilter)
      throw new HttpException('Feed Filter does not exist.', 404);
    if (feedFilter.user.id !== user.id)
      throw new HttpException('', HttpStatus.FORBIDDEN);

    await this.mediaService.scrapeMediaForFilter(feedFilter);

    return this.mediaService.getMediaForFilter(feedFilter.id);
  }
}
