import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { FeedFilter } from './feed-filter.entity';
import { FeedFilterService } from './feed-filter.service';
import { FeedFilterJobsService } from './feed-filter.jobs';
import { DUser } from '../decorators/user.decorator';
import { User } from 'src/user/user.entity';
import { Auth } from 'src/decorators/auth.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateFeedFilterDto } from './dtos/create-feed-filter.dto';

@ApiTags('Feed Filters')
@Controller('feed-filters')
export class FeedFilterController {
  constructor(
    private feedFilterService: FeedFilterService,
    private feedFilterJobsService: FeedFilterJobsService,
  ) {}

  @Get()
  @Auth('read:allfilters')
  @ApiOperation({ summary: 'Get user feed-filters.' })
  async getFiltersForUser(@DUser() user: User): Promise<FeedFilter[]> {
    return this.feedFilterService.getFiltersForUser(user.id);
  }

  @Post()
  @Auth('create:filter')
  @ApiOperation({ summary: 'Create a new feed-filter.' })
  async create(
    @DUser() user: User,
    @Body() feedFilter: CreateFeedFilterDto,
  ): Promise<FeedFilter> {
    feedFilter.user = user;

    const createdFeedFilter = await this.feedFilterService.create(feedFilter);

    this.feedFilterJobsService.createScrapeMediaForFilterJob({
      feedFilterId: createdFeedFilter.id,
    });

    delete createdFeedFilter.user;

    return createdFeedFilter;
  }

  @Delete(':filterId')
  @Auth('delete:filter')
  @ApiOperation({ summary: 'Delete a feed-filter.' })
  async delete(
    @DUser() user: User,
    @Param('filterId') filterId: string,
  ): Promise<void> {
    await this.feedFilterService.delete(user.id, filterId);

    this.feedFilterJobsService.deleteScapeMediaForFilterJob(filterId);

    return;
  }
}
