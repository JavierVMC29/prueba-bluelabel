// src/users/dtos/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

import { UserThemeEnum } from '../enums/user-theme.enum';
import { UserLanguageEnum } from '../enums/user-language.enum';

export class SettingsDto {
  @IsEnum(UserThemeEnum, { message: 'El tema debe ser dark o light' })
  @IsOptional()
  theme?: string;

  @IsBoolean()
  @IsOptional()
  notifications?: boolean;

  @IsEnum(UserLanguageEnum, { message: 'El idioma debe ser es o en' })
  @IsOptional()
  language?: string;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SettingsDto)
  settings?: SettingsDto;
}
