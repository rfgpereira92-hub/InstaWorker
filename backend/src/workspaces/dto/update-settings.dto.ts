import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsInt()
  stories_per_day?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  time_slots?: string[];

  @IsOptional()
  @IsBoolean()
  auto_post_enabled?: boolean;

  @IsOptional()
  @IsInt()
  max_repetition_days?: number;
}

