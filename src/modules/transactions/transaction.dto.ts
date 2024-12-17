import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive, IsInt } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 'DEPOSIT', description: 'Tipo da transação' })
  @IsEnum(['DEPOSIT', 'WITHDRAW'])
  type: 'DEPOSIT' | 'WITHDRAW';

  @ApiProperty({ example: 100, description: 'Valor da transação' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 1, description: 'ID do usuário remetente' })
  @IsInt()
  userId: number;
}

export class TransferTransactionDto {
  @ApiProperty({ example: 50, description: 'Valor da transferência' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 1, description: 'ID do usuário remetente' })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 2, description: 'ID do usuário destinatário' })
  @IsInt()
  targetUserId: number;
}
