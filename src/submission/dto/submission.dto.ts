import { IsDateString, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/user.entity';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Media } from 'src/media/media.entity';

export class SubmissionDto {
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  caption?: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  scheduledFor?: Date = new Date();

  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  attributionUsername?: string;

  @ApiHideProperty()
  user?: User;

  @ApiHideProperty()
  media?: Media;
}
