import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { TransactionsService } from '../transactions/transactions.service';

@Processor('transactions')
export class TransactionProcessor {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Process()
  async handleTransaction(job: Job) {
    const { dto } = job.data;
    console.log(`Processing transaction: ${JSON.stringify(dto)}`);

    try {
      await this.transactionsService.createTransaction(dto);
      console.log('Transaction processed successfully');
    } catch (error) {
      console.error('Error processing transaction:', error.message);
    }
  }
}
