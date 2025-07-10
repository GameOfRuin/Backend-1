import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class PasswordRestoreChangeDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(32)
  @MinLength(5)
  password: string;

  @IsString()
  code: string;
}
