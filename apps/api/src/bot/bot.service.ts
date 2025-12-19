import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { StateMachineService } from './services/state-machine.service';
import { MessageLogService } from './services/message-log.service';

@Injectable()
export class BotService {
  constructor(
    private prisma: PrismaService,
    private stateMachine: StateMachineService,
    private messageLog: MessageLogService,
  ) {}

  async handleIncomingMessage(phone: string, body: string): Promise<string> {
    // Process message through state machine
    const { response, newState } = await this.stateMachine.processMessage(
      phone,
      body,
    );

    // Get or create conversation session for logging
    const candidate = await this.prisma.candidate.findUnique({
      where: { phone },
      include: { conversation: true },
    });

    if (candidate?.conversation) {
      const sessionId = candidate.conversation.id;

      // Log inbound message
      await this.messageLog.logMessage(sessionId, 'INBOUND', body);

      // Log outbound response
      await this.messageLog.logMessage(sessionId, 'OUTBOUND', response);
    }

    return response;
  }
}

