import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { EventsService } from './events.service';
import { BatchEventsDto } from './dto/batch-events.dto';
import { ScanEventDto } from './dto/scan-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('batch')
  async batch(@Body() dto: BatchEventsDto, @Res() res: Response) {
    const result = await this.eventsService.processBatch(dto.events);

    // Return 206 if partial success, 200 if all succeeded
    if (result.failed > 0 && result.synced > 0) {
      // Partial success - 206
      return res.status(HttpStatus.PARTIAL_CONTENT).json({
        synced: result.synced,
        failed: result.failed,
        errors: result.errors,
      });
    }

    if (result.failed > 0 && result.synced === 0) {
      // All failed - 400
      return res.status(HttpStatus.BAD_REQUEST).json({
        synced: result.synced,
        failed: result.failed,
        errors: result.errors,
      });
    }

    // All succeeded - 200
    return res.status(HttpStatus.OK).json({
      synced: result.synced,
      failed: 0,
      errors: [],
    });
  }

  @Post('scan')
  @HttpCode(HttpStatus.OK)
  async scan(@Body() dto: ScanEventDto) {
    const result = await this.eventsService.processSingleScan(dto);
    return result;
  }
}

