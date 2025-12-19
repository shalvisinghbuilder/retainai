import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsISO8601,
} from 'class-validator';

export class SentimentSubmitDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  score: number;

  @IsISO8601()
  @IsNotEmpty()
  respondedAt: string;
}

