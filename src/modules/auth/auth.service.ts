import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida as credenciais do usuário e retorna um token JWT
   * @param email Email do usuário
   * @param password Senha do usuário
   */
  async validateUser(email: string, password: string): Promise<string> {
    // Validações de entrada
    if (!email || !password) {
      throw new BadRequestException('Email and password are required.');
    }
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Invalid email format.');
    }

    try {
      // Busca o usuário pelo e-mail
      const user = await this.userService.findByEmail(email);

      // Verifica se o usuário existe
      if (!user) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      // Verifica se a senha é válida
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      // Gera o JWT Token
      const payload = { sub: user.id, email: user.email };
      return this.jwtService.sign(payload);
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to validate user credentials.');
    }
  }

  /**
   * Método auxiliar para validar o formato de e-mail
   * @param email Email a ser validado
   * @returns boolean
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
