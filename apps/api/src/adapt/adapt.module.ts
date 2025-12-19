import { Module } from '@nestjs/common';
import { AdaptController } from './adapt.controller';
import { AdaptService } from './adapt.service';
import { AdaptScheduler } from './adapt.scheduler';

@Module({
  controllers: [AdaptController],
  providers: [AdaptService, AdaptScheduler],
})
export class AdaptModule {}

