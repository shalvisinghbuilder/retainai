import { IsString, IsNotEmpty } from 'class-validator';

export class OverrideDto {
  @IsString()
  @IsNotEmpty()
  exemptionReason: string;
}

