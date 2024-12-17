import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { DailyReportProcessor } from './daily-report.processor';
import { ReportScheduler } from './report.scheduler';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transactions',
    }),
  ],
  providers: [DailyReportProcessor, ReportScheduler],
})
export class QueueModule {}

