import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { UserService } from '../user/user.service';

// DTOs Tipados
interface CreateTransactionDto {
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  userId: number;
}

interface TransferTransactionDto {
  amount: number;
  userId: number;
  targetUserId: number;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly userService: UserService,
  ) {}

  // Método para Depósito e Saque
  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const { type, amount, userId } = dto;

    // Validações iniciais
    if (!type || !['DEPOSIT', 'WITHDRAW'].includes(type)) {
      throw new BadRequestException('Transaction type must be DEPOSIT or WITHDRAW.');
    }
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero.');
    }

    // Busca o usuário
    const user = await this.userService.findById(userId);
    if (!user) throw new NotFoundException('User not found.');

    // Lógica de Depósito e Saque
    if (type === 'DEPOSIT') {
      user.balance = Number(user.balance) + Number(amount);
    } else if (type === 'WITHDRAW') {
      if (Number(user.balance) < Number(amount)) {
        throw new BadRequestException('Insufficient balance.');
      }
      user.balance = Number(user.balance) - Number(amount);
    }

    // Atualiza o saldo do usuário
    await this.userService.updateUserBalance(user.id, user.balance);

    // Cria e salva a transação
    try {
      const transaction = this.transactionRepository.create({ type, amount, user });
      return await this.transactionRepository.save(transaction);
    } catch (error) {
      throw new BadRequestException('Failed to save transaction.');
    }
  }

  // Método para Transferências
  async transferTransaction(dto: TransferTransactionDto): Promise<Transaction> {
    const { amount, userId, targetUserId } = dto;

    // Validações iniciais
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero.');
    }
    if (userId === targetUserId) {
      throw new BadRequestException('Cannot transfer to the same user.');
    }

    // Busca os usuários
    const user = await this.userService.findById(userId);
    const targetUser = await this.userService.findById(targetUserId);

    if (!user) throw new NotFoundException('User not found.');
    if (!targetUser) throw new NotFoundException('Target user not found.');

    if (Number(user.balance) < Number(amount)) {
      throw new BadRequestException('Insufficient balance for transfer.');
    }

    // Atualiza os saldos
    user.balance = Number(user.balance) - Number(amount);
    targetUser.balance = Number(targetUser.balance) + Number(amount);

    try {
      await this.userService.updateUserBalance(user.id, user.balance);
      await this.userService.updateUserBalance(targetUser.id, targetUser.balance);

      // Cria e salva a transação
      const transaction = this.transactionRepository.create({
        type: 'TRANSFER',
        amount,
        user,
        targetUser,
      });
      return await this.transactionRepository.save(transaction);
    } catch (error) {
      throw new BadRequestException('Failed to complete transfer.');
    }
  }

  // Buscar transações de um usuário
  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required.');
    }

    try {
      return await this.transactionRepository.find({
        where: { user: { id: userId } },
        relations: ['user', 'targetUser'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch transactions.');
    }
  }
}
