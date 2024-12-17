import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransferTransactionDto } from './transaction.dto';
import { ApiTags, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // Rota para Depósito e Saque
  @Post()
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({ status: 201, description: 'Depósito ou saque realizado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  async createTransaction(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(dto);
  }

  // Rota para Transferências
  @Post('transfer')
  @ApiBody({ type: TransferTransactionDto })
  @ApiResponse({ status: 201, description: 'Transferência realizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Requisição inválida.' })
  async transfer(@Body() dto: TransferTransactionDto) {
    return this.transactionsService.transferTransaction(dto);
  }

  // Buscar transações de um usuário
  @Get(':userId')
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de transações do usuário.' })
  async getTransactionsByUser(@Param('userId') userId: number) {
    return this.transactionsService.getTransactionsByUser(userId);
  }
}
