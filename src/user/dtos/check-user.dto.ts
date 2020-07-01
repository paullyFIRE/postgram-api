import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class CheckUserDto extends PickType(UserDto, ['auth0UserRef']) {}