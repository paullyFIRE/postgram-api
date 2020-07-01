import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { FeedFilterService } from 'src/feed-filter/feed-filter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedFilter } from 'src/feed-filter/feed-filter.entity';
import { User } from 'src/user/user.entity';
import { MediaService } from 'src/media/media.service';
import { Media } from 'src/media/media.entity';
import { AgendaModule } from 'nestjs-agenda';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media, User, FeedFilter]),
    AgendaModule.registerAsync({
      useFactory: async () => ({
        db: { address: process.env.MONOGDB_URL },
      }),
    }),
  ],
  providers: [FeedService, FeedFilterService, MediaService, UserService],
  controllers: [FeedController],
})
export class FeedModule { }
