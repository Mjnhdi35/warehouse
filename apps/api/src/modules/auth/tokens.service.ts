import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/entities/user.entity';
import { Inject } from '@nestjs/common';
import { TOKEN_STORE, TokenStore } from './interfaces/token-store.interface';
import { extractExp, extractSub } from '../../common';
import {
  ACCESS_TOKEN_EXPIRES,
  buildPayload,
  REFRESH_TOKEN_EXPIRES,
  RefreshJwtPayload,
} from '../../common';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(TOKEN_STORE) private readonly refreshStore: TokenStore,
  ) {}

  private async signAccessToken(user: UserEntity): Promise<string> {
    const payload = buildPayload(user);
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: ACCESS_TOKEN_EXPIRES,
    });
  }

  private async signRefreshToken(user: UserEntity): Promise<string> {
    const payload = buildPayload(user);
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: REFRESH_TOKEN_EXPIRES,
    });
    const exp = extractExp(this.jwtService.decode(token));
    await this.refreshStore.allow(user.id, token, exp);
    return token;
  }

  async issueFor(user: UserEntity) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user),
      this.signRefreshToken(user),
    ]);
    return { accessToken, refreshToken };
  }

  async rotate(refreshToken: string) {
    const payload = await this.verifyRefresh(refreshToken);
    const allowed = await this.refreshStore.isAllowed(
      payload.sub,
      refreshToken,
    );
    if (!allowed) throw new UnauthorizedException('Invalid refresh token');

    await this.refreshStore.blacklist(refreshToken, payload.exp, payload.sub);
    await this.refreshStore.revoke(payload.sub, refreshToken);

    return payload;
  }

  async revoke(refreshToken: string): Promise<{ success: true }> {
    const decoded: unknown = this.jwtService.decode(refreshToken);
    const sub = extractSub(decoded);
    const exp = extractExp(decoded);
    if (sub) await this.refreshStore.revoke(sub, refreshToken);
    await this.refreshStore.blacklist(refreshToken, exp, sub ?? 'unknown');

    return { success: true } as const;
  }

  private async verifyRefresh(token: string): Promise<RefreshJwtPayload> {
    return this.jwtService
      .verifyAsync<RefreshJwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      })
      .catch(() => {
        throw new UnauthorizedException('Invalid refresh token');
      });
  }
}
