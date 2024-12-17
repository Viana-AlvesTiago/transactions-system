import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly SALT_ROUNDS = 10; // Número de rounds para hashing de senha

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Cria um novo usuário
   * @param createUserDto Dados do usuário a ser criado
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    // Validações de entrada
    if (!email || !password) {
      throw new BadRequestException('Email and password are required.');
    }
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format.');
    }
    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long.');
    }

    // Verifica se o usuário já existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists.');
    }

    try {
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

      // Cria o usuário
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        balance: 0, // Saldo inicial como 0
      });

      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user.');
    }
  }

  /**
   * Busca um usuário por ID
   * @param id ID do usuário
   */
  async findById(id: number): Promise<User> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid user ID.');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  /**
   * Busca um usuário pelo e-mail
   * @param email Email do usuário
   */
  async findByEmail(email: string): Promise<User> {
    if (!email || !this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format.');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found.`);
    }
    return user;
  }

  /**
   * Atualiza o saldo de um usuário
   * @param userId ID do usuário
   * @param newBalance Novo saldo do usuário
   */
  async updateUserBalance(userId: number, newBalance: number): Promise<User> {
    if (newBalance < 0) {
      throw new BadRequestException('Balance cannot be negative.');
    }

    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    try {
      user.balance = newBalance;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user balance.');
    }
  }

  /**
   * Valida o formato do e-mail
   * @param email E-mail a ser validado
   * @returns boolean
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
