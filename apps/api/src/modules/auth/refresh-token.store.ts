import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import {
  blacklistRedisKey,
  computeTtlFromEpochSeconds,
  refreshRedisKey,
} from '../../common';

type RefreshAllowValue = { uid: string };
type BlacklistValue = { uid: string };

@Injectable()
export class RefreshTokenStore {
  constructor(private readonly redis: RedisService) {}

  async allow(userId: string, token: string, exp?: number): Promise<void> {
    const ttl = computeTtlFromEpochSeconds(exp);
    if (ttl > 0) {
      await this.redis.set<RefreshAllowValue>(
        refreshRedisKey(userId, token),
        { uid: userId },
        ttl,
      );
    }
  }

  async isAllowed(userId: string, token: string): Promise<boolean> {
    const found = await this.redis.get<RefreshAllowValue>(
      refreshRedisKey(userId, token),
    );
    return !!found;
  }

  async revoke(userId: string, token: string): Promise<void> {
    await this.redis.del(refreshRedisKey(userId, token));
  }

  async blacklist(
    token: string,
    exp?: number,
    userId: string = 'unknown',
  ): Promise<void> {
    const ttl = computeTtlFromEpochSeconds(exp);
    if (ttl > 0) {
      await this.redis.set<BlacklistValue>(
        blacklistRedisKey(token),
        { uid: userId },
        ttl,
      );
    }
  }
}
