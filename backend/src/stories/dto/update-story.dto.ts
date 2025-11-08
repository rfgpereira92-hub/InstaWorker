import { IsOptional, IsString } from 'class-validator';

export class UpdateStoryDto {
  @IsOptional()
  @IsString()
  headline?: string;

  @IsOptional()
  @IsString()
  body_text?: string;

  @IsOptional()
  @IsString()
  cta_text?: string;
}

