import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CaptionTemplateDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly baseTemplate: string;

  @ApiProperty()
  @IsString()
  user?: User;
}
