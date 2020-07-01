import { OmitType, PartialType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(OmitType(UserDto, ['auth0UserRef'])) {}