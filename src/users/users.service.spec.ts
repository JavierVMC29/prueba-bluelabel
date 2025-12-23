// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

import { Logger } from 'nestjs-pino';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Task } from './entities/task.entity';

// 1. Mock de los Repositorios (Simulamos TypeORM)
const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
};

const mockTaskRepository = {
  create: jest.fn(),
  save: jest.fn(),
};

// Mock del Logger de Pino
const mockLogger = {
  log: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        // Inyectamos los mocks en lugar de la conexión real a la BD
        {
          provide: getRepositoryToken(User, 'mysql'),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Task, 'mysql'),
          useValue: mockTaskRepository,
        },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Limpiar los mocks antes de cada test
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear y guardar un usuario correctamente', async () => {
      const dto = { name: 'Test', email: 'nuevo@test.com' };
      const expectedUser = { id: 1, ...dto, isActive: true };

      // IMPORTANTE: Aseguramos que NO encuentre un usuario previo
      mockUserRepository.findOneBy.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(dto);
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(dto as any);

      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual(expectedUser);
    });

    it('debe lanzar error si el email ya existe', async () => {
      const dto = { name: 'Test', email: 'existo@test.com' };

      // Simulamos que findOneBy ENCUENTRA un usuario (simula duplicado)
      mockUserRepository.findOneBy.mockResolvedValue({
        id: 1,
        email: 'existo@test.com',
      });

      // Esperamos que lance error (ConflictException o BadRequestException)
      await expect(service.create(dto as any)).rejects.toThrow();
    });
  });

  describe('createTask', () => {
    it('debe lanzar error si el usuario no existe', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.createTask(999, { title: 'Tarea Nueva' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe guardar la tarea si el usuario existe', async () => {
      const mockUser = { id: 1, name: 'Juan' };
      const dto = { title: 'Nueva Tarea' };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockTaskRepository.create.mockReturnValue({ ...dto, user: mockUser });
      mockTaskRepository.save.mockResolvedValue({ id: 1, ...dto });

      await service.createTask(1, dto);

      expect(mockTaskRepository.save).toHaveBeenCalled();
    });
  });

  describe('updateSettings (Lógica JSON)', () => {
    it('debe lanzar NotFoundException si el usuario no existe', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateSettings(999, { theme: 'dark' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('debe hacer merge de settings existentes con los nuevos', async () => {
      // Escenario: El usuario ya tiene settings
      const existingUser = {
        id: 1,
        settings: { theme: 'light', language: 'en', notifications: true },
      };

      // Queremos cambiar SOLO el tema a dark
      const updateDto = { theme: 'dark' };

      mockUserRepository.findOneBy.mockResolvedValue(existingUser);
      // Simulamos que al guardar devuelve el usuario modificado
      mockUserRepository.save.mockImplementation((user) =>
        Promise.resolve(user),
      );

      const result = await service.updateSettings(1, updateDto as any);

      // Verificamos que 'theme' cambió, pero 'language' se mantuvo (Merge correcto)
      expect(result.settings.theme).toBe('dark');
      expect(result.settings.language).toBe('en');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });
});
