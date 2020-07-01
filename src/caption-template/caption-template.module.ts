import { Module } from '@nestjs/common';
import { CaptionTemplateController } from './caption-template.controller';
import { CaptionTemplateService } from './caption-template.service';
import { CaptionTemplate } from './caption-template.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CaptionTemplate, User])],
  controllers: [CaptionTemplateController],
  providers: [CaptionTemplateService, UserService],
})
export class CaptionTemplateModule {}
