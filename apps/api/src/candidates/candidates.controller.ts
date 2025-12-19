import { Controller, Post, Body } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { VjtSubmitDto } from './dto/vjt-submit.dto';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post('vjt/submit')
  async submitVJT(@Body() dto: VjtSubmitDto) {
    return this.candidatesService.submitVJT(dto);
  }
}

