import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user.enums';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;
  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('some-hash-number'),
  };
  const mockUsersRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((user) =>
        Promise.resolve({ id: Date.now(), ...user }),
      ),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },

        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should signup and return the user', async () => {
    const createUserDto = {
      email: 'hashkh12@gmail.com',
      password: '1234567891',
      last_name: 'hash',
      first_name: 'kh',
      role: UserRole.MERCHANT,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };
    const result = await service.create(createUserDto);
    delete createUserDto.password;
    expect(mockUsersRepository.create).toHaveBeenCalledWith(createUserDto);
    expect(mockUsersRepository.save).toHaveBeenCalled();
    // expect(result).toEqual(expect.any(User));
  });

  it('should validate and return the user', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    mockUsersRepository.findOne.mockResolvedValue({
      email,
      password: await bcrypt.hash(password, 10),
    });
    const result = await service.validateUser(email, password);
    expect(result).toBeDefined();
  });

  it('should return a JWT token on successful login', async () => {
    const user = { email: 'test@example.com', id: '123' };
    const result = await service.login(user);
    expect(result).toEqual({ access_token: 'mocked-jwt-token' });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
