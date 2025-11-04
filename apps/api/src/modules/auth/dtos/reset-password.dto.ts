import { IsEmail, IsString, MinLength } from 'class-validator';

export class RequestResetPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsString()
  token: string;
}
