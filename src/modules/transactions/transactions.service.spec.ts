import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let userService: UserService;
  let transactionRepository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: UserService,
          useValue: {
            findById: jest.fn(),
            updateUserBalance: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    userService = module.get<UserService>(UserService);
    transactionRepository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
  });

  const mockUserSender = {
    id: 1,
    email: 'sender@example.com',
    password: 'hashed_password',
    balance: 100,
  };

  const mockUserRecipient = {
    id: 2,
    email: 'recipient@example.com',
    password: 'hashed_password',
    balance: 100,
  };

  const mockTransaction = {
    id: 1,
    type: 'TRANSFER',
    amount: 50,
    user: mockUserSender,
    targetUser: mockUserRecipient,
    createdAt: new Date(),
  } as Transaction;

  it('should create a transfer transaction', async () => {
    // Mock para buscar os usuários
    jest
      .spyOn(userService, 'findById')
      .mockResolvedValueOnce({ ...mockUserSender }) // Sender
      .mockResolvedValueOnce({ ...mockUserRecipient }); // Recipient

    // Mock para atualizar o saldo do remetente e destinatário
    jest
      .spyOn(userService, 'updateUserBalance')
      .mockResolvedValueOnce({ ...mockUserSender, balance: 50 }) // 1ª chamada: saldo atualizado do remetente
      .mockResolvedValueOnce({ ...mockUserRecipient, balance: 150 }); // 2ª chamada: saldo atualizado do destinatário

    // Mock para criar e salvar a transação
    jest.spyOn(transactionRepository, 'create').mockReturnValue(mockTransaction);
    jest.spyOn(transactionRepository, 'save').mockResolvedValue(mockTransaction);

    // Execução do serviço
    const result = await service.transferTransaction({
      amount: 50,
      userId: 1,
      targetUserId: 2,
    });

    // Verificações
    expect(result.type).toBe('TRANSFER');
    expect(result.amount).toBe(50);
    expect(userService.updateUserBalance).toHaveBeenCalledTimes(2);
    expect(userService.updateUserBalance).toHaveBeenCalledWith(1, 50); // Saldo atualizado do remetente
    expect(userService.updateUserBalance).toHaveBeenCalledWith(2, 150); // Saldo atualizado do destinatário
    expect(transactionRepository.save).toHaveBeenCalledWith(mockTransaction);
  });

  it('should throw NotFoundException if sender or recipient does not exist', async () => {
    jest.spyOn(userService, 'findById').mockResolvedValueOnce(mockUserSender).mockResolvedValueOnce(undefined);

    await expect(
      service.transferTransaction({
        amount: 50,
        userId: 1,
        targetUserId: 2,
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if sender has insufficient balance', async () => {
    jest.spyOn(userService, 'findById').mockResolvedValueOnce({ ...mockUserSender, balance: 30 });
    jest.spyOn(userService, 'findById').mockResolvedValueOnce(mockUserRecipient);

    await expect(
      service.transferTransaction({
        amount: 50,
        userId: 1,
        targetUserId: 2,
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
