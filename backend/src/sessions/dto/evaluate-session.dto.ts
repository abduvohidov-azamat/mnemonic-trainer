import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EvaluateSessionDto {
  @IsNotEmpty()
  @IsString()
  discipline: 'numbers' | 'cards' | 'words';

  @IsNotEmpty()
  config: Record<string, any>;

  @IsNotEmpty()
  targetSequence: any;

  @IsNotEmpty()
  recallSequence: any;

  @IsNotEmpty()
  @IsNumber()
  durationMs: number;

  @IsOptional()
  @IsNumber()
  recallDurationMs?: number;
}
