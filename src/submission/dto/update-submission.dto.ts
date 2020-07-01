import { PartialType, OmitType } from '@nestjs/swagger';
import { SubmissionDto } from './submission.dto';

export class UpdateSubmissionDto extends PartialType(
  OmitType(SubmissionDto, ['attributionUsername', 'user', 'media']),
) {}
