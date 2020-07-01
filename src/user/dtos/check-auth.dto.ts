import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class CheckAuthDto extends PickType(UserDto, [
  'instagramUsername',
  'instagramPassword',
]) {}
