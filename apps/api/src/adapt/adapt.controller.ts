import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AdaptService } from './adapt.service';
import { ApproveDto } from './dto/approve.dto';
import { OverrideDto } from './dto/override.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@retainai/db';

@Controller('adapt')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MANAGER, Role.ADMIN)
export class AdaptController {
  constructor(private readonly adaptService: AdaptService) {}

  @Get('queue')
  async getQueue() {
    return this.adaptService.getQueue();
  }

  @Put(':id/approve')
  async approve(@Param('id') id: string, @Body() dto: ApproveDto) {
    try {
      await this.adaptService.approve(id, dto.managerNote);
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'AdaptRecord not found') {
          throw new NotFoundException({
            statusCode: 404,
            errorCode: 'NOT_FOUND',
            message: 'AdaptRecord not found',
            timestamp: new Date().toISOString(),
          });
        }
        if (error.message.includes('PENDINGREVIEW')) {
          throw new BadRequestException({
            statusCode: 400,
            errorCode: 'VALIDATION_ERROR',
            message: error.message,
            timestamp: new Date().toISOString(),
          });
        }
      }
      throw error;
    }
  }

  @Put(':id/override')
  async override(@Param('id') id: string, @Body() dto: OverrideDto) {
    try {
      await this.adaptService.override(id, dto.exemptionReason);
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'AdaptRecord not found') {
          throw new NotFoundException({
            statusCode: 404,
            errorCode: 'NOT_FOUND',
            message: 'AdaptRecord not found',
            timestamp: new Date().toISOString(),
          });
        }
        if (error.message.includes('PENDINGREVIEW')) {
          throw new BadRequestException({
            statusCode: 400,
            errorCode: 'VALIDATION_ERROR',
            message: error.message,
            timestamp: new Date().toISOString(),
          });
        }
      }
      throw error;
    }
  }
}

