import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { BotService } from './bot.service';
import { TwilioSignatureGuard } from './guards/twilio-signature.guard';

@Controller('api/bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post('webhook')
  @UseGuards(TwilioSignatureGuard)
  async webhook(
    @Body() body: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const phone = body.From;
    const messageBody = body.Body || '';

    if (!phone) {
      return res.status(400).json({
        statusCode: 400,
        errorCode: 'VALIDATION_ERROR',
        message: 'Missing phone number',
        timestamp: new Date().toISOString(),
      });
    }

    const response = await this.botService.handleIncomingMessage(
      phone,
      messageBody,
    );

    // Return TwiML response
    res.type('text/xml');
    return res.send(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${this.escapeXml(response)}</Message></Response>`,
    );
  }

  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}

