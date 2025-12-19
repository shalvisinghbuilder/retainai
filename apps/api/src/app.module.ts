import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { BotModule } from './bot/bot.module';
import { CandidatesModule } from './candidates/candidates.module';
import { EventsModule } from './events/events.module';
import { AdaptModule } from './adapt/adapt.module';
import { MapModule } from './map/map.module';
import { SentimentModule } from './sentiment/sentiment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    HealthModule,
    AuthModule,
    BotModule,
    CandidatesModule,
    EventsModule,
    AdaptModule,
    MapModule,
    SentimentModule,
  ],
})
export class AppModule {}

