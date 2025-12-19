import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWTSECRET'),
    });
  }

  async validate(payload: any) {
    const employee = await this.prisma.employee.findUnique({
      where: { id: payload.sub },
    });

    if (!employee) {
      throw new UnauthorizedException({
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
        message: 'Employee not found',
        timestamp: new Date().toISOString(),
      });
    }

    return {
      id: employee.id,
      badgeId: employee.badgeId,
      role: employee.role,
    };
  }
}

