import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly instagramUsername: string;

  @ApiProperty()
  @IsString()
  readonly instagramPassword: string;

  @ApiProperty()
  @IsString()
  readonly auth0UserRef: string;
}
