// src/users/users.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';

import { Logger } from 'nestjs-pino';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mock del Servicio
  const mockUsersService = {
    create: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
    findAll: jest.fn(() => Promise.resolve([])),
    createTask: jest.fn((userId, dto) =>
      Promise.resolve({ id: 1, userId, ...dto }),
    ),
    updateSettings: jest.fn((id, dto) => Promise.resolve({ id, ...dto })),
  };

  // Mock del Logger de Pino
  const mockLogger = {
    log: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe llamar al servicio create', async () => {
      const dto = { name: 'Test', email: 't@t.com', password: '123' };
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(mockLogger.log).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debe llamar al servicio findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('debe llamar al servicio createTask', async () => {
      const dto = { title: 'New Task' };
      await controller.createTask(1, dto);
      expect(service.createTask).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('updateSettings', () => {
    it('debe llamar al servicio updateSettings', async () => {
      const dto = { theme: 'dark' };
      await controller.updateSettings(1, dto);
      expect(service.updateSettings).toHaveBeenCalledWith(1, dto);
    });
  });
});
