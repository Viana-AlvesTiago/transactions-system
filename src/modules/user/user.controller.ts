import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('users') // Tag usada para organização no Swagger
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiBody({ type: CreateUserDto }) // Define o formato do body esperado
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
