import { Test, TestingModule } from '@nestjs/testing';
import { DailyReportProcessor } from './daily-report.processor';

describe('DailyReportProcessor', () => {
  let processor: DailyReportProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyReportProcessor],
    }).compile();

    processor = module.get<DailyReportProcessor>(DailyReportProcessor);
  });

  it('should process daily reports', async () => {
    const mockJob = { id: 1, data: {} };
    const consoleSpy = jest.spyOn(console, 'log');

    await processor.handleDailyReport(mockJob as any);

    expect(consoleSpy).toHaveBeenCalledWith('Processing daily report job...');
  });
});
