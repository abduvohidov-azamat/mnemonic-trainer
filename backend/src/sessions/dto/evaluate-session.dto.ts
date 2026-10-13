import { IsDefined, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EvaluateSessionDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['numbers', 'cards', 'words'])
  discipline: 'numbers' | 'cards' | 'words';

  @IsNotEmpty()
  config: Record<string, any>;

  @IsNotEmpty()
  targetSequence: any;

  @IsDefined()
  recallSequence: any;

  @IsNotEmpty()
  @IsNumber()
  durationMs: number;

  @IsOptional()
  @IsNumber()
  recallDurationMs?: number;
}
