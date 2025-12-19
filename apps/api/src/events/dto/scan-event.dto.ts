import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsISO8601,
  IsNumber,
  Min,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ScanType } from '@retainai/db';

export class ScanEventDto {
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  barcode: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(ScanType)
  actionType: ScanType;

  @IsISO8601()
  @IsNotEmpty()
  timestamp: string;

  @IsNumber()
  @Min(0)
  expectedSeconds: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  actualSeconds?: number;

  @IsBoolean()
  @IsOptional()
  isError?: boolean;

  @IsString()
  @IsOptional()
  errorCode?: string;
}

