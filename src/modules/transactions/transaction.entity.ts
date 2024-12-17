import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER';

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => User, { nullable: true })
  targetUser?: User;

  @CreateDateColumn()
  createdAt: Date;
}

