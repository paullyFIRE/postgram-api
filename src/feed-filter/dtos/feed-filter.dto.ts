import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { FeedFilterTypes } from "../feed-filter.interface";
import { User } from "src/user/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class FeedFilterDto {
  @ApiProperty({ enum: FeedFilterTypes })
  @IsEnum(FeedFilterTypes)
  @IsNotEmpty()
  readonly type: FeedFilterTypes

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly value: string

  @ApiProperty()
  @IsString()
  user?: User
}