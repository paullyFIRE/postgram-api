import { PartialType, PickType } from '@nestjs/swagger';
import { FeedFilterDto } from './feed-filter.dto';

export class CreateFeedFilterDto extends PartialType(
  PickType(FeedFilterDto, ['type', 'value']),
) {}
