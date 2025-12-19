import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SentimentSubmitDto } from './dto/sentiment-submit.dto';

@Injectable()
export class SentimentService {
  constructor(private prisma: PrismaService) {}

  async submitSentiment(
    employeeId: string,
    sentimentDto: SentimentSubmitDto,
  ): Promise<{ id: string; message: string }> {
    // Verify employee exists
    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException({
        statusCode: 404,
        errorCode: 'EMPLOYEE_NOT_FOUND',
        message: 'Employee not found',
        timestamp: new Date().toISOString(),
      });
    }

    // Parse respondedAt to get date bucket (start of day in UTC)
    const respondedAt = new Date(sentimentDto.respondedAt);
    const dateStart = new Date(
      Date.UTC(
        respondedAt.getUTCFullYear(),
        respondedAt.getUTCMonth(),
        respondedAt.getUTCDate(),
      ),
    );
    const dateEnd = new Date(dateStart);
    dateEnd.setUTCDate(dateEnd.getUTCDate() + 1);

    // Check if sentiment already submitted for this employee today
    const existing = await this.prisma.sentimentResponse.findFirst({
      where: {
        employeeId,
        questionId: sentimentDto.questionId,
        respondedAt: {
          gte: dateStart,
          lt: dateEnd,
        },
      },
    });

    if (existing) {
      // Treat as idempotent success (same as scan events)
      return {
        id: existing.id,
        message: 'Sentiment already submitted for today',
      };
    }

    // Create new sentiment response
    const sentimentResponse = await this.prisma.sentimentResponse.create({
      data: {
        employeeId,
        questionId: sentimentDto.questionId,
        score: sentimentDto.score,
        respondedAt: respondedAt,
      },
    });

    return {
      id: sentimentResponse.id,
      message: 'Sentiment submitted successfully',
    };
  }
}

