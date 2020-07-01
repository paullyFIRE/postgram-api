import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatedUserResponseDto {
  @ApiProperty()
  @IsString()
  readonly userId: string;
}
