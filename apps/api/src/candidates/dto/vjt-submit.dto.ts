import { IsString, IsNotEmpty, IsInt, Min, Max, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MetaDto {
  @IsOptional()
  @IsString()
  clientVersion?: string;
}

export class VjtSubmitDto {
  @IsString()
  @IsNotEmpty()
  candidateId: string;

  @IsString()
  @IsNotEmpty()
  nonce: string;

  @IsInt()
  @Min(0)
  @Max(1000)
  skillScore: number;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => MetaDto)
  meta?: MetaDto;
}

