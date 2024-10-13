import { UniqueUserEmail } from './validators/unique-user-email.validator';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @UniqueUserEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  displayName: string;

  role: string;
}
