import { ApiProperty, PartialType } from '@nestjs/swagger';
import { SubmissionDto } from './submission.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateSubmissionDto extends PartialType(SubmissionDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  mediaId: string;
}
