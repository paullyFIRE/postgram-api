import { Module } from '@nestjs/common';
import { FeedFilterService } from './feed-filter.service';
import { FeedFilterController } from './feed-filter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedFilter } from './feed-filter.entity';
import { User } from 'src/user/user.entity';
import { AgendaModule } from 'nestjs-agenda';
import { FeedFilterJobsService } from './feed-filter.jobs';
import { MediaService } from 'src/media/media.service';
import { Media } from 'src/media/media.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedFilter, User, Media]),
    AgendaModule.registerAsync({
      useFactory: async () => ({
        db: { address: process.env.MONOGDB_URL },
      }),
    }),
  ],
  providers: [FeedFilterService, FeedFilterJobsService, MediaService, UserService],
  controllers: [FeedFilterController],
})
export class FeedFilterModule {}
