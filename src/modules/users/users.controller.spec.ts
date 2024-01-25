import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRole } from './user.enums';

describe('UsersController', () => {
  let controller: UsersController;

  // Mock implementation of UsersService
  const mockUsersService = {
    signup: jest.fn((dto) => Promise.resolve({ id: Date.now(), ...dto })),
    create: jest.fn((dto) => Promise.resolve({ id: Date.now(), ...dto })),
    validateUser: jest.fn((email, password) =>
      Promise.resolve({ email, password }),
    ),
    login: jest.fn((user) => Promise.resolve('token')),
    findAll: jest.fn(() => Promise.resolve([])),
    findOne: jest.fn((id) => Promise.resolve({ id })),
    update: jest.fn((id, dto) => Promise.resolve({ id, ...dto })),
    remove: jest.fn((id) => Promise.resolve({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should call signup method with expected params', async () => {
      const createUserDto = {
        email: 'hashkh12@gmail.com',
        password: '1234567891',
        last_name: 'hash',
        first_name: 'kh',
        role: UserRole.MERCHANT,
      };
      await controller.signup(createUserDto);
      expect(mockUsersService.signup).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should call validateUser and login methods with expected params', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      await controller.login(dto);
      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
      expect(mockUsersService.login).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should call findAll method', async () => {
      await controller.findAll();
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call findOne method with expected param', async () => {
      const userId = '1';
      await controller.findOne(userId);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(userId);
    });
  });
});
