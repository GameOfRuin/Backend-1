import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordChangeDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(32)
  @MinLength(5)
  password: string;
}
