// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '@src/users/entities/user.entity';
import { Task } from '@src/users/entities/task.entity';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Task], 'mysql')],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
