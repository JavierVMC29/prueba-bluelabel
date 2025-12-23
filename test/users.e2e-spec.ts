import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import request from 'supertest';

import { UsersModule } from './../src/users/users.module';
import { User } from './../src/users/entities/user.entity';
import { Task } from './../src/users/entities/task.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  // Mocks simples para E2E
  const mockUserRepo = {
    find: jest.fn().mockResolvedValue([{ id: 1, name: 'E2E User', tasks: [] }]),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) => Promise.resolve({ id: 1, ...user })),
    findOneBy: jest.fn().mockImplementation(({ id }) => {
      if (id === 1)
        return Promise.resolve({ id: 1, settings: { theme: 'light' } });
      return null;
    }),
  };

  const mockTaskRepo = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((task) => Promise.resolve({ id: 100, ...task })),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      // SOBRESCRIBIMOS LA BD REAL CON MOCKS
      // Esto permite probar Endpoints sin Mysql corriendo
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepo)
      .overrideProvider(getRepositoryToken(Task))
      .useValue(mockTaskRepo)
      .compile();

    app = moduleFixture.createNestApplication();

    // Importante: Habilitar pipes para probar validaciones (DTOs)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // 1. Probar GET /users
  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].name).toBe('E2E User');
      });
  });

  // 2. Probar POST /users (Validación)
  it('/users (POST) - Debería fallar sin email', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Sin Email' }) // Falta email
      .expect(400); // Bad Request
  });

  it('/users (POST) - Éxito', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Javier', email: 'javier@test.com' })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.email).toBe('javier@test.com');
      });
  });

  // 3. Probar PATCH settings
  it('/users/:id/settings (PATCH) - Merge settings', () => {
    return request(app.getHttpServer())
      .patch('/users/1/settings')
      .send({ theme: 'dark' })
      .expect(200)
      .expect((res) => {
        // El mock devuelve el objeto merged
        expect(res.body.settings.theme).toBe('dark');
      });
  });
});
