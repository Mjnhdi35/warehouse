import { IsJWT, IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsJWT()
  @IsOptional()
  refreshToken?: string;
}
