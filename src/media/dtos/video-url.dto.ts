import { IsString, IsNotEmpty } from "class-validator";

export class VideoUrlDto {
  @IsString()
  @IsNotEmpty()
  videoUrl: string
}