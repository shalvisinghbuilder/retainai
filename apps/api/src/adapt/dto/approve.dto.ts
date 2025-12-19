import { IsString, IsOptional } from 'class-validator';

export class ApproveDto {
  @IsString()
  @IsOptional()
  managerNote?: string;
}

