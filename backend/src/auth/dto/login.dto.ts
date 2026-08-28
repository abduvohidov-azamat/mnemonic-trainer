import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  identifier: string; // email or username

  @MinLength(6)
  password: string;
}
