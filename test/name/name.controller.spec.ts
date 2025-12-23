import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from '@src/auth/interfaces/jwt-payload.interface';
import { UpdateNameDto } from '@src/name/dtos/update-name.dto';
import { NameController } from '@src/name/name.controller';
import { NameService } from '@src/name/name.service';
import { AuthGuard } from 'nest-keycloak-connect';

describe('NameController', () => {
  let controller: NameController;
  let nameService: NameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NameController],
      providers: [
        {
          provide: NameService,
          useValue: {
            update: jest.fn(),
          },
        },
        {
          provide: 'KEYCLOAK_INSTANCE',
          useValue: {}, // Mock vacío
        },
        {
          provide: 'KEYCLOAK_CONNECT_OPTIONS',
          useValue: {}, // Mock vacío
        },
        {
          provide: 'KEYCLOAK_LOGGER',
          useValue: console, // Usa `console` como mock
        },
        {
          provide: 'KEYCLOAK_MULTITENANT_SERVICE',
          useValue: {}, // Mock vacío
        },
        {
          provide: AuthGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) }, // Mock del guard
        },
        Reflector,
      ],
    }).compile();

    controller = module.get<NameController>(NameController);
    nameService = module.get<NameService>(NameService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateName', () => {
    it('should call nameService.update with correct parameters', async () => {
      const user: JwtPayload = {
        guestId: 'guest123',
        userId: 'user123',
        preferred_username: 'testuser',
      } as JwtPayload;

      const updateNameDto: UpdateNameDto = {
        firstName: 'John',
        lastName: 'Doe',
      };

      await controller.updateName(user, updateNameDto);

      expect(nameService.update).toHaveBeenCalledWith({
        guestId: user.guestId,
        userId: user.userId,
        username: user.preferred_username,
        updateNameDto,
      });
    });
  });
});
