import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { MediaController } from './media.controller';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, User])],
  controllers: [MediaController],
  providers: [MediaService, UserService],
})
export class MediaModule {}
