import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Headers,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dtos/user.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { AuthRequestUser, getBearerToken, Public } from '../../common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private isAuthRequestUser(u: unknown): u is AuthRequestUser {
    return (
      typeof u === 'object' &&
      u !== null &&
      'userId' in (u as Record<string, unknown>) &&
      'email' in (u as Record<string, unknown>)
    );
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const result = await this.authService.login(body);
    if (result?.accessToken) {
      (req.res as Response).setHeader(
        'Authorization',
        `Bearer ${result.accessToken}`,
      );
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  whoami(@Req() req: Request): AuthRequestUser | undefined {
    const candidate = (req as unknown as { user?: unknown }).user;
    return this.isAuthRequestUser(candidate) ? candidate : undefined;
  }

  @Public()
  @Post('register')
  async register(
    @Body() body: CreateUserDto,
    @Req() req: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const result = await this.authService.register(body);
    if (result?.accessToken) {
      (req.res as Response).setHeader(
        'Authorization',
        `Bearer ${result.accessToken}`,
      );
    }
    return result;
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Headers('authorization') auth: string,
    @Body() body: RefreshTokenDto,
    @Req() req: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const token = getBearerToken(auth) ?? body?.refreshToken ?? '';
    if (!token) throw new UnauthorizedException('Missing refresh token');
    const result = await this.authService.refresh(token);
    if (result?.accessToken) {
      (req.res as Response).setHeader(
        'Authorization',
        `Bearer ${result.accessToken}`,
      );
    }
    return result;
  }

  @Public()
  @Post('logout')
  async logout(
    @Headers('authorization') auth: string,
    @Body() body: RefreshTokenDto,
  ): Promise<{ success: true }> {
    const token = getBearerToken(auth) ?? body?.refreshToken ?? '';
    if (!token) throw new UnauthorizedException('Missing refresh token');
    return this.authService.logout(token);
  }
}
