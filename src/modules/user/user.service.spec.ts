import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed_password',
    balance: 100,
  };

  it('should create a user successfully', async () => {
    const createUserDto = { email: 'test@example.com', password: '123456' };
    const hashedPassword = 'hashed_password';

    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(userRepository, 'create').mockReturnValue({ ...mockUser } as User);
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

    const result = await service.create(createUserDto);
    expect(result).toEqual(mockUser);
  });

  it('should throw error if user already exists', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    await expect(service.create({ email: mockUser.email, password: '123456' })).rejects.toThrow(BadRequestException);
  });

  it('should find a user by ID', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
    const result = await service.findById(1);
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException when user not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);
    await expect(service.findById(1)).rejects.toThrow(NotFoundException);
  });

  it('should update user balance successfully', async () => {
    const updatedUser = { ...mockUser, balance: 200 };
    jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
    jest.spyOn(userRepository, 'save').mockResolvedValue(updatedUser);

    const result = await service.updateUserBalance(1, 200);
    expect(result.balance).toBe(200);
  });
});
