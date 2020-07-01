import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './submission.entity';
import { MediaService } from 'src/media/media.service';
import { UserService } from 'src/user/user.service';
import { Media } from 'src/media/media.entity'
import { User } from 'src/user/user.entity';
import { SubmissionJobsService } from 'src/submission/submission.jobs'
import { AgendaModule } from 'nestjs-agenda';

@Module({
  imports: [TypeOrmModule.forFeature([Submission, Media, User]),
  AgendaModule.registerAsync({
    useFactory: async () => ({
      db: { address: process.env.MONOGDB_URL },
    }),
  }),
  ],
  providers: [SubmissionService, MediaService, UserService, SubmissionJobsService],
  controllers: [SubmissionController]
})
export class SubmissionModule { }
