import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('transactions')
export class DailyReportProcessor {
  @Process('generateDailyReport')
  async handleDailyReport(job: Job) {
    console.log('Processing daily report job...');
    // Lógica para geração de relatório
  }
}

