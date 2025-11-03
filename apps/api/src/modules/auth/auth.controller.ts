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

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto, @Req() req: Request): Promise<any> {
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
  whoami(@Req() req: Request & { user?: AuthRequestUser }) {
    return (req as any).user;
  }

  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto, @Req() req: Request) {
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
  ) {
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
  ) {
    const token = getBearerToken(auth) ?? body?.refreshToken ?? '';
    if (!token) throw new UnauthorizedException('Missing refresh token');
    return this.authService.logout(token);
  }
}
