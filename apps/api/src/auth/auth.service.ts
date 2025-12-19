import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { badgeId: loginDto.badgeId },
    });

    if (!employee) {
      throw new NotFoundException({
        statusCode: 404,
        errorCode: 'EMPLOYEE_NOT_FOUND',
        message: 'Employee with this badge ID not found',
        timestamp: new Date().toISOString(),
      });
    }

    const payload = {
      sub: employee.id,
      badgeId: employee.badgeId,
      role: employee.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('JWTSECRET') + '_refresh',
    });

    return {
      accessToken,
      refreshToken,
      employee: {
        id: employee.id,
        badgeId: employee.badgeId,
        role: employee.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const secret = this.configService.get<string>('JWTSECRET') + '_refresh';
      const payload = this.jwtService.verify(refreshToken, { secret });

      const employee = await this.prisma.employee.findUnique({
        where: { id: payload.sub },
      });

      if (!employee) {
        throw new UnauthorizedException({
          statusCode: 401,
          errorCode: 'UNAUTHORIZED',
          message: 'Invalid refresh token',
          timestamp: new Date().toISOString(),
        });
      }

      const newPayload = {
        sub: employee.id,
        badgeId: employee.badgeId,
        role: employee.role,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
        secret,
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException({
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
        message: 'Invalid or expired refresh token',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

