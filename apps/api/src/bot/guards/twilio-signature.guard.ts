import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { validateRequest } from 'twilio';

@Injectable()
export class TwilioSignatureGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const signature = request.headers['x-twilio-signature'];
    const url = this.getRequestUrl(request);

    if (!signature) {
      throw new UnauthorizedException({
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
        message: 'Missing Twilio signature',
        timestamp: new Date().toISOString(),
      });
    }

    if (!authToken) {
      throw new ForbiddenException({
        statusCode: 403,
        errorCode: 'FORBIDDEN',
        message: 'Twilio configuration missing',
        timestamp: new Date().toISOString(),
      });
    }

    // Get form data for validation
    const params = request.body || {};

    try {
      const isValid = validateRequest(authToken, signature, url, params);

      if (!isValid) {
        throw new ForbiddenException({
          statusCode: 403,
          errorCode: 'FORBIDDEN',
          message: 'Invalid Twilio signature',
          timestamp: new Date().toISOString(),
        });
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException({
        statusCode: 403,
        errorCode: 'FORBIDDEN',
        message: 'Twilio signature validation failed',
        timestamp: new Date().toISOString(),
      });
    }
  }

  private getRequestUrl(request: any): string {
    const protocol = request.protocol || 'http';
    const host = request.get('host');
    const originalUrl = request.originalUrl || request.url;
    return `${protocol}://${host}${originalUrl}`;
  }
}

