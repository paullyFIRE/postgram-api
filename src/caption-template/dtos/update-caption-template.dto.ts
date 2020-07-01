import { PickType } from '@nestjs/swagger';
import { CaptionTemplateDto } from './caption-template.dto';

export class UpdateCaptionTemplateDto extends PickType(CaptionTemplateDto, [
  'name',
  'baseTemplate',
]) {}
