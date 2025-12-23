// src/users/dtos/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

export class SettingsDto {
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
