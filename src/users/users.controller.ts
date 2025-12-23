// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';

import { Logger } from 'nestjs-pino';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateSettingsDto } from './dtos/update-settings.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Endpoint: POST /users');
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    this.logger.log('Endpoint: GET /users');
    return this.usersService.findAll();
  }

  @Post(':userId/tasks')
  createTask(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    this.logger.log(`Endpoint: POST /users/${userId}/tasks`);
    return this.usersService.createTask(userId, createTaskDto);
  }

  @Patch(':id/settings')
  updateSettings(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    this.logger.log(`Endpoint: PATCH /users/${id}/settings`);
    return this.usersService.updateSettings(id, updateSettingsDto);
  }
}
