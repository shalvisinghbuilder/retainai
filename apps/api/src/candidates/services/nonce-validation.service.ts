import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';

@Injectable()
export class NonceValidationService {
  constructor(private configService: ConfigService) {}

  validateVJTNonce(nonce: string, candidateId: string): boolean {
    const secret = this.configService.get<string>('JWTSECRET');
    if (!secret) {
      throw new Error('JWTSECRET is not configured');
    }

    try {
      const decoded = verify(nonce, secret) as any;

      // Validate nonce type
      if (decoded.type !== 'vjt') {
        throw new UnauthorizedException({
          statusCode: 401,
          errorCode: 'UNAUTHORIZED',
          message: 'Invalid nonce type',
          timestamp: new Date().toISOString(),
        });
      }

      // Validate candidate ID matches
      if (decoded.candidateId !== candidateId) {
        throw new UnauthorizedException({
          statusCode: 401,
          errorCode: 'UNAUTHORIZED',
          message: 'Nonce does not match candidate',
          timestamp: new Date().toISOString(),
        });
      }

      // Expiration is checked automatically by verify()
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException({
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
        message: 'Invalid or expired nonce',
        timestamp: new Date().toISOString(),
      });
    }
  }
}

