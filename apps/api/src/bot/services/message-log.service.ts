import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class MessageLogService {
  constructor(private prisma: PrismaService) {}

  async logMessage(
    sessionId: string,
    direction: 'INBOUND' | 'OUTBOUND',
    content: string,
  ): Promise<void> {
    await this.prisma.messageLog.create({
      data: {
        sessionId,
        direction,
        content,
        timestamp: new Date(),
      },
    });
  }
}

