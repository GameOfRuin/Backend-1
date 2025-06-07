import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(32)
  @MinLength(5)
  password: string;
}
export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
