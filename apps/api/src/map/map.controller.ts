import { Controller, Get, UseGuards } from '@nestjs/common';
import { MapService } from './map.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@retainai/db';

@Controller('map')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MANAGER, Role.ADMIN)
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('floor-state')
  async getFloorState() {
    return this.mapService.getFloorState();
  }
}

