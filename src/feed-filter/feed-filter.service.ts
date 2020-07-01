import { Injectable, HttpException, HttpStatus, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { FeedFilter } from './feed-filter.entity';
import { CreateFeedFilterDto } from './dtos/create-feed-filter.dto';

@Injectable()
export class FeedFilterService {
  constructor(
    @InjectRepository(FeedFilter)
    private feedFilterRepo: Repository<FeedFilter>,
  ) {}

  findById(filterId: string): Promise<FeedFilter> {
    return this.feedFilterRepo.findOne(filterId, { relations: ['user']});
  }

  getFiltersForUser(userId: string): Promise<FeedFilter[]> {
    return this.feedFilterRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async delete(userId: string, filterId: string): Promise<DeleteResult> {
    const existingFilter = await this.feedFilterRepo.findOne({
      relations: ['user'],
      where: {
        id: filterId,
      },
    });

    if(!existingFilter) throw new NotFoundException()
    if(existingFilter.user.id !== userId) throw new ForbiddenException()

    return this.feedFilterRepo.delete(filterId);
  }

  async create(feedFilter: CreateFeedFilterDto): Promise<FeedFilter> {
    const existingFilter = await this.feedFilterRepo.findOne({
      where: {
        type: feedFilter.type,
        value: feedFilter.value,
        user: {
          id: feedFilter.user.id,
        },
      },
    });

    if (existingFilter)
      throw new HttpException('Filter already exists.', HttpStatus.CONFLICT);

    return this.feedFilterRepo.save(feedFilter);
  }
}
