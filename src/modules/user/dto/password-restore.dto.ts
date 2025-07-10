import { IsEmail } from 'class-validator';

export class PasswordRestoreDto {
  @IsEmail()
  email: string;
}
