import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

@Injectable()
export class NonceService {
  constructor(private configService: ConfigService) {}

  generateVJTNonce(candidateId: string): string {
    const secret = this.configService.get<string>('JWTSECRET');
    if (!secret) {
      throw new Error('JWTSECRET is not configured');
    }
    const payload = {
      candidateId,
      type: 'vjt',
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    };

    return sign(payload, secret);
  }
}

