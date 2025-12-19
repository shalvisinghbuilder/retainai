import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { CandidateStatus } from '@retainai/db';
import { NonceService } from './nonce.service';

export type BotState =
  | 'GREETING'
  | 'AWAITING_NAME'
  | 'AWAITING_AGE_CONFIRM'
  | 'AWAITING_LIFT_CONFIRM'
  | 'VJT_LINK_SENT'
  | 'REJECTED';

@Injectable()
export class StateMachineService {
  private readonly YES_ALIASES = ['Y', 'YES', 'YEP', 'OK', 'SURE'];
  private readonly NO_ALIASES = ['N', 'NO', 'NOPE'];

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private nonceService: NonceService,
  ) {}

  normalizeInput(input: string): string {
    return input.trim().toUpperCase();
  }

  isYes(input: string): boolean {
    const normalized = this.normalizeInput(input);
    return this.YES_ALIASES.includes(normalized);
  }

  isNo(input: string): boolean {
    const normalized = this.normalizeInput(input);
    return this.NO_ALIASES.includes(normalized);
  }

  async processMessage(
    phone: string,
    body: string,
  ): Promise<{ response: string; newState: BotState }> {
    // Find or create candidate
    let candidate = await this.prisma.candidate.findUnique({
      where: { phone },
      include: { conversation: true },
    });

    if (!candidate) {
      candidate = await this.prisma.candidate.create({
        data: {
          phone,
          status: CandidateStatus.NEW,
          conversation: {
            create: {
              currentState: 'GREETING',
            },
          },
        },
        include: { conversation: true },
      });
    }

    // Ensure conversation session exists
    let session = candidate.conversation;
    if (!session) {
      session = await this.prisma.conversationSession.create({
        data: {
          candidateId: candidate.id,
          currentState: 'GREETING',
        },
      });
    }

    const currentState = session.currentState as BotState;
    const normalizedBody = body.trim();

    // State machine transitions
    switch (currentState) {
      case 'GREETING':
        return this.handleGreeting(candidate.id, normalizedBody);

      case 'AWAITING_NAME':
        return this.handleName(candidate.id, normalizedBody);

      case 'AWAITING_AGE_CONFIRM':
        return this.handleAgeConfirm(candidate.id, normalizedBody);

      case 'AWAITING_LIFT_CONFIRM':
        return this.handleLiftConfirm(candidate.id, normalizedBody);

      case 'VJT_LINK_SENT':
        return this.handleVJTLinkSent(candidate.id);

      case 'REJECTED':
        return this.handleRejected();

      default:
        return {
          response: 'Hello! Thank you for your interest. What is your full legal name?',
          newState: 'AWAITING_NAME',
        };
    }
  }

  private async handleGreeting(
    candidateId: string,
    body: string,
  ): Promise<{ response: string; newState: BotState }> {
    await this.updateCandidateStatus(candidateId, CandidateStatus.SCREENING);
    await this.updateSessionState(candidateId, 'AWAITING_NAME');

    return {
      response: 'Hello! Thank you for your interest. What is your full legal name?',
      newState: 'AWAITING_NAME',
    };
  }

  private async handleName(
    candidateId: string,
    body: string,
  ): Promise<{ response: string; newState: BotState }> {
    if (!body || body.length === 0) {
      return {
        response: 'Please provide your full legal name.',
        newState: 'AWAITING_NAME',
      };
    }

    await this.prisma.candidate.update({
      where: { id: candidateId },
      data: { name: body },
    });

    await this.updateSessionState(candidateId, 'AWAITING_AGE_CONFIRM');

    return {
      response: 'Are you 18 years or older? Please reply YES or NO.',
      newState: 'AWAITING_AGE_CONFIRM',
    };
  }

  private async handleAgeConfirm(
    candidateId: string,
    body: string,
  ): Promise<{ response: string; newState: BotState }> {
    if (this.isYes(body)) {
      await this.updateSessionState(candidateId, 'AWAITING_LIFT_CONFIRM');
      return {
        response: 'Can you lift 50lbs repeatedly? Please reply YES or NO.',
        newState: 'AWAITING_LIFT_CONFIRM',
      };
    } else if (this.isNo(body)) {
      await this.updateCandidateStatus(candidateId, CandidateStatus.REJECTEDCOOLDOWN);
      await this.updateSessionState(candidateId, 'REJECTED');
      return {
        response: 'Thank you for your interest. Unfortunately, you must be 18 or older to apply.',
        newState: 'REJECTED',
      };
    } else {
      return {
        response: 'Please reply YES or NO. Are you 18 years or older?',
        newState: 'AWAITING_AGE_CONFIRM',
      };
    }
  }

  private async handleLiftConfirm(
    candidateId: string,
    body: string,
  ): Promise<{ response: string; newState: BotState }> {
    if (this.isYes(body)) {
      await this.updateCandidateStatus(candidateId, CandidateStatus.VJTPENDING);
      await this.updateSessionState(candidateId, 'VJT_LINK_SENT');

      const vjtLink = this.generateVJTLink(candidateId);
      return {
        response: `Great! Please complete this assessment: ${vjtLink}`,
        newState: 'VJT_LINK_SENT',
      };
    } else if (this.isNo(body)) {
      await this.updateCandidateStatus(candidateId, CandidateStatus.REJECTEDCOOLDOWN);
      await this.updateSessionState(candidateId, 'REJECTED');
      return {
        response: 'Thank you for your interest. Unfortunately, this role requires the ability to lift 50lbs repeatedly.',
        newState: 'REJECTED',
      };
    } else {
      return {
        response: 'Please reply YES or NO. Can you lift 50lbs repeatedly?',
        newState: 'AWAITING_LIFT_CONFIRM',
      };
    }
  }

  private async handleVJTLinkSent(
    candidateId: string,
  ): Promise<{ response: string; newState: BotState }> {
    const vjtLink = this.generateVJTLink(candidateId);
    return {
      response: `Here's your assessment link again: ${vjtLink}`,
      newState: 'VJT_LINK_SENT',
    };
  }

  private handleRejected(): { response: string; newState: BotState } {
    return {
      response: 'Thank you for your interest. Unfortunately, you do not meet the requirements at this time.',
      newState: 'REJECTED',
    };
  }

  private generateVJTLink(candidateId: string): string {
    const baseUrl = this.configService.get<string>('VJT_BASE_URL', 'http://localhost:3001');
    const nonce = this.nonceService.generateVJTNonce(candidateId);
    return `${baseUrl}?candidate=${candidateId}&nonce=${nonce}`;
  }

  private async updateCandidateStatus(
    candidateId: string,
    status: CandidateStatus,
  ): Promise<void> {
    await this.prisma.candidate.update({
      where: { id: candidateId },
      data: { status },
    });
  }

  private async updateSessionState(
    candidateId: string,
    state: BotState,
  ): Promise<void> {
    await this.prisma.conversationSession.upsert({
      where: { candidateId },
      update: { currentState: state },
      create: {
        candidateId,
        currentState: state,
      },
    });
  }
}

