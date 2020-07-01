import { PartialType, PickType } from '@nestjs/swagger';
import { CaptionTemplateDto } from './caption-template.dto';

export class CreateCaptionTemplateDto extends PartialType(
  PickType(CaptionTemplateDto, ['name', 'baseTemplate']),
) {}
