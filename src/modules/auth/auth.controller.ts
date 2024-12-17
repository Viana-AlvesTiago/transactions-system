import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './auth.dto';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth') // Adiciona uma tag para organizar no Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('signin')
  @ApiBody({ type: SignInDto })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async signin(@Body() credentials: SignInDto) {
    return {
      token: await this.authService.validateUser(
        credentials.email,
        credentials.password,
      ),
    };
  }
}

