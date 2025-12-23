// src/users/dtos/update-settings.dto.ts
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateSettingsDto {
  @IsString()
  @IsOptional()
  theme?: string;

  @IsBoolean()
  @IsOptional()
  notifications?: boolean;

  @IsString()
  @IsOptional()
  language?: string;
}
