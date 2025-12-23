// src/users/dtos/update-settings.dto.ts
import { IsOptional, IsBoolean, IsEnum } from 'class-validator';

import { UserLanguageEnum } from '../enums/user-language.enum';
import { UserThemeEnum } from '../enums/user-theme.enum';

export class UpdateSettingsDto {
  @IsOptional()
  @IsEnum(UserThemeEnum, { message: 'El tema debe ser dark o light' })
  theme?: string;

  @IsBoolean()
  @IsOptional()
  notifications?: boolean;

  @IsOptional()
  @IsEnum(UserLanguageEnum, { message: 'El idioma debe ser es o en' })
  language?: string;
}
