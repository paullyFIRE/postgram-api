import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedFilterModule } from './feed-filter/feed-filter.module';
import { UserModule } from './user/user.module';
import { FeedModule } from './feed/feed.module';
import { MediaModule } from './media/media.module';
import { SubmissionModule } from './submission/submission.module';
import { AuthModule } from './auth/auth.module';
import { CaptionTemplateModule } from './caption-template/caption-template.module';

import './interfaces';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      database: process.env.MYSQL_DATABASE,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      autoLoadEntities: true,
      charset: 'utf8mb4',
      synchronize: true,
    }),
    FeedFilterModule,
    UserModule,
    FeedModule,
    MediaModule,
    SubmissionModule,
    AuthModule,
    CaptionTemplateModule,
  ],
})
export class AppModule {}
