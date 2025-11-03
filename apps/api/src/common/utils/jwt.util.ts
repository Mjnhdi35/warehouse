import { UserEntity } from '../../modules/users/entities/user.entity';
import { JwtPayload } from '../types/jwt-payload.type';

export function buildPayload(
  user: Pick<UserEntity, 'id' | 'email' | 'displayName'>,
): JwtPayload {
  return { sub: user.id, email: user.email, name: user.displayName };
}

export function getBearerToken(
  authorizationHeader: string | undefined | null,
): string | null {
  if (!authorizationHeader) return null;
  const token = authorizationHeader.replace(/^Bearer\s+/i, '').trim();
  return token.length ? token : null;
}

export function refreshRedisKey(userId: string, token: string): string {
  return `auth:refresh:${userId}:${token}`;
}

export function blacklistRedisKey(token: string): string {
  return `auth:blacklist:${token}`;
}

export function computeTtlFromEpochSeconds(
  exp?: number,
  nowSec: number = Math.floor(Date.now() / 1000),
): number {
  return Math.max(0, (exp ?? nowSec) - nowSec);
}

export function extractExp(decoded: unknown): number | undefined {
  if (decoded && typeof decoded === 'object') {
    const exp = (decoded as Record<string, unknown>).exp;
    if (typeof exp === 'number') return exp;
  }
  return undefined;
}

export function extractSub(decoded: unknown): string | undefined {
  if (decoded && typeof decoded === 'object') {
    const sub = (decoded as Record<string, unknown>).sub;
    if (typeof sub === 'string') return sub;
  }
  return undefined;
}
