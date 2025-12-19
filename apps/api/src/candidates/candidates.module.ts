import { Module } from '@nestjs/common';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { NonceValidationService } from './services/nonce-validation.service';

@Module({
  controllers: [CandidatesController],
  providers: [CandidatesService, NonceValidationService],
})
export class CandidatesModule {}

