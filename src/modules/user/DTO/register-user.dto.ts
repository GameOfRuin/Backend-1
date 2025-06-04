import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(14)
  @MinLength(3)
  password: string;
}
export class LoginrUserDto {
  @IsString()
  nickname: string;

  @IsString()
  password: string;
}
