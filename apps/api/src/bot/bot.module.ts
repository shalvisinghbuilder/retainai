import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { StateMachineService } from './services/state-machine.service';
import { MessageLogService } from './services/message-log.service';
import { NonceService } from './services/nonce.service';

@Module({
  controllers: [BotController],
  providers: [
    BotService,
    StateMachineService,
    MessageLogService,
    NonceService,
  ],
})
export class BotModule {}

