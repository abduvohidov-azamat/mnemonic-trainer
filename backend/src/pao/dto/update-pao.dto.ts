import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePaoDto {
  @IsOptional()
  @IsString()
  person?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  object?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
