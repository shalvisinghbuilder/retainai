import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ScanType } from '@retainai/db';
import { ScanEventDto } from './dto/scan-event.dto';

interface ProcessedEvent {
  eventId: string;
  success: boolean;
  error?: {
    reason: string;
    message: string;
  };
}

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async processBatch(events: ScanEventDto[]): Promise<{
    synced: number;
    failed: number;
    errors: Array<{ eventId: string; reason: string; message: string }>;
  }> {
    const results: ProcessedEvent[] = [];

    // Process each event
    for (const event of events) {
      try {
        await this.processSingleEvent(event);
        results.push({ eventId: event.eventId, success: true });
      } catch (error) {
        results.push({
          eventId: event.eventId,
          success: false,
          error: {
            reason: 'VALIDATION_ERROR',
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    }

    const synced = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;
    const errors = results
      .filter((r) => !r.success)
      .map((r) => ({
        eventId: r.eventId,
        reason: r.error!.reason,
        message: r.error!.message,
      }));

    return { synced, failed, errors };
  }

  async processSingleEvent(event: ScanEventDto): Promise<void> {
    // Check if event already exists (idempotency)
    const existing = await this.prisma.scanEvent.findUnique({
      where: { id: event.eventId },
    });

    if (existing) {
      // Idempotency: treat duplicate as success
      return;
    }

    // Validate employee exists
    const employee = await this.prisma.employee.findUnique({
      where: { id: event.employeeId },
    });

    if (!employee) {
      throw new NotFoundException(
        `Employee with ID ${event.employeeId} not found`,
      );
    }

    // Parse timestamp
    const timestamp = new Date(event.timestamp);
    if (isNaN(timestamp.getTime())) {
      throw new BadRequestException('Invalid timestamp format');
    }

    // Create scan event
    await this.prisma.scanEvent.create({
      data: {
        id: event.eventId, // Use client-generated UUID
        employeeId: event.employeeId,
        barcode: event.barcode,
        location: event.location,
        actionType: event.actionType as ScanType,
        timestamp,
        expectedSeconds: event.expectedSeconds,
        actualSeconds: event.actualSeconds ?? null,
        isError: event.isError ?? false,
        errorCode: event.errorCode ?? null,
      },
    });
  }

  async processSingleScan(event: ScanEventDto): Promise<{ success: boolean }> {
    try {
      await this.processSingleEvent(event);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

