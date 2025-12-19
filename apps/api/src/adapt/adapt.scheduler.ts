import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AdaptService } from './adapt.service';

@Injectable()
export class AdaptScheduler {
  constructor(private adaptService: AdaptService) {}

  @Cron('0 4 * * *') // Daily at 04:00
  async handleDailyAnalysis() {
    console.log('Running ADAPT daily analysis at 04:00...');
    try {
      await this.adaptService.runDailyAnalysis();
      console.log('ADAPT daily analysis completed successfully');
    } catch (error) {
      console.error('ADAPT daily analysis failed:', error);
    }
  }
}

