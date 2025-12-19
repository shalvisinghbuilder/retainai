import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { SentimentSubmitDto } from './dto/sentiment-submit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@retainai/db';

@Controller('sentiment')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ASSOCIATE, Role.MANAGER, Role.ADMIN)
export class SentimentController {
  constructor(private readonly sentimentService: SentimentService) {}

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submitSentiment(
    @Request() req: any,
    @Body() sentimentDto: SentimentSubmitDto,
  ) {
    const employeeId = req.user.id; // From JWT strategy (returns { id, badgeId, role })
    const result = await this.sentimentService.submitSentiment(
      employeeId,
      sentimentDto,
    );
    return result;
  }
}

