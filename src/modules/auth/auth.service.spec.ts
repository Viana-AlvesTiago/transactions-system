import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: { findByEmail: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed_password',
    balance: 100,
  };

  it('should return JWT token if credentials are valid', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwtService, 'sign').mockReturnValue('token');

    const result = await authService.validateUser('test@example.com', 'password');
    expect(result).toBe('token');
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(authService.validateUser('test@example.com', 'wrong_password')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user does not exist', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(undefined);

    await expect(authService.validateUser('test@example.com', 'password')).rejects.toThrow(UnauthorizedException);
  });
});
