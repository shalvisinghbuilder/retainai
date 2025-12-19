import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CandidateStatus } from '@retainai/db';
import { NonceValidationService } from './services/nonce-validation.service';
import { VjtSubmitDto } from './dto/vjt-submit.dto';

@Injectable()
export class CandidatesService {
  private readonly PASS_THRESHOLD = 600;

  constructor(
    private prisma: PrismaService,
    private nonceValidation: NonceValidationService,
  ) {}

  async submitVJT(dto: VjtSubmitDto) {
    // Validate nonce
    this.nonceValidation.validateVJTNonce(dto.nonce, dto.candidateId);

    // Find candidate
    const candidate = await this.prisma.candidate.findUnique({
      where: { id: dto.candidateId },
    });

    if (!candidate) {
      throw new NotFoundException({
        statusCode: 404,
        errorCode: 'NOT_FOUND',
        message: 'Candidate not found',
        timestamp: new Date().toISOString(),
      });
    }

    // Check if candidate is in cooldown
    if (candidate.coolDownUntil && candidate.coolDownUntil > new Date()) {
      throw new BadRequestException({
        statusCode: 400,
        errorCode: 'VALIDATION_ERROR',
        message: `Candidate is in cooldown until ${candidate.coolDownUntil.toISOString()}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Check if candidate is in correct status
    if (candidate.status !== CandidateStatus.VJTPENDING) {
      throw new BadRequestException({
        statusCode: 400,
        errorCode: 'VALIDATION_ERROR',
        message: `Candidate status must be VJTPENDING, current: ${candidate.status}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Determine pass/fail
    const passed = dto.skillScore >= this.PASS_THRESHOLD;
    const newStatus = passed
      ? CandidateStatus.VJTPASSED
      : CandidateStatus.VJTFAILED;

    // Calculate cooldown if failed
    const coolDownUntil = passed
      ? null
      : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days

    // Update candidate
    await this.prisma.candidate.update({
      where: { id: dto.candidateId },
      data: {
        status: newStatus,
        coolDownUntil,
      },
    });

    // Create assessment result
    await this.prisma.assessmentResult.upsert({
      where: { candidateId: dto.candidateId },
      update: {
        skillScore: dto.skillScore,
        passed,
        completedAt: new Date(),
      },
      create: {
        candidateId: dto.candidateId,
        skillScore: dto.skillScore,
        passed,
        completedAt: new Date(),
      },
    });

    return {
      passed,
      candidateStatus: newStatus,
      coolDownUntil,
    };
  }
}

