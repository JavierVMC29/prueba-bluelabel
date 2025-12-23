// src/users/users.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dtos/create-user.dto';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateSettingsDto } from './dtos/update-settings.dto';
import { User } from './entities/user.entity';
import { Task } from './entities/task.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User, 'mysql')
    private usersRepository: Repository<User>,
    @InjectRepository(Task, 'mysql')
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Creando nuevo usuario: ${createUserDto.email}`);

    try {
      const user = this.usersRepository.create(createUserDto);
      const savedUser = await this.usersRepository.save(user);

      this.logger.debug(`Usuario creado con ID: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(
        `Error al crear usuario: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll() {
    this.logger.log('Obteniendo todos los usuarios y sus tareas');
    return this.usersRepository.find({
      relations: {
        tasks: true,
      },
    });
  }

  async createTask(userId: number, createTaskDto: CreateTaskDto) {
    this.logger.log(`Intentando crear tarea para usuario ID: ${userId}`);

    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      this.logger.warn(
        `Intento de crear tarea para usuario inexistente ID: ${userId}`,
      );
      throw new NotFoundException('Usuario no encontrado');
    }

    const task = this.tasksRepository.create({
      ...createTaskDto,
      user: user,
    });

    const savedTask = await this.tasksRepository.save(task);
    this.logger.debug(`Tarea creada con ID: ${savedTask.id}`);
    return savedTask;
  }

  async updateSettings(id: number, settingsDto: UpdateSettingsDto) {
    this.logger.log(`Actualizando settings para usuario ID: ${id}`);

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      this.logger.warn(
        `Usuario ID ${id} no encontrado para actualizar settings`,
      );
      throw new NotFoundException('Usuario no encontrado');
    }

    this.logger.debug(`Settings anteriores: ${JSON.stringify(user.settings)}`);

    user.settings = {
      ...user.settings,
      ...settingsDto,
    };

    const updatedUser = await this.usersRepository.save(user);
    this.logger.log(
      `Settings actualizados correctamente para usuario ID: ${id}`,
    );

    return updatedUser;
  }
}
