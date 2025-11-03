import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import type { Redis as UpstashRedis } from '@upstash/redis';
import { createRedisClient, AnyRedisClient } from './redis.config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: AnyRedisClient;

  async onModuleInit() {
    this.client = await createRedisClient();
    this.logger.log(
      `✅ Redis connected (${
        process.env.UPSTASH_REDIS_REST_URL ? 'Upstash' : 'Local'
      })`,
    );
  }

  async onModuleDestroy() {
    if ('quit' in this.client) {
      await this.client.quit();
    }
    this.logger.log('🧹 RedisService destroyed');
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const data = JSON.stringify(value);

    if ('set' in this.client && 'setEx' in this.client) {
      if (ttlSeconds) await this.client.setEx(key, ttlSeconds, data);
      else await this.client.set(key, data);
    } else {
      if (ttlSeconds) await this.client.set(key, data, { ex: ttlSeconds });
      else await this.client.set(key, data);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    let raw: string | null;

    if ('get' in this.client) {
      raw = await this.client.get(key);
    } else {
      raw = await (this.client as UpstashRedis).get<string>(key);
    }

    return raw ? (JSON.parse(raw) as T) : null;
  }

  async del(key: string): Promise<void> {
    if ('del' in this.client) await this.client.del(key);
    else await (this.client as UpstashRedis).del(key);
  }

  async ping(): Promise<boolean> {
    try {
      if ('ping' in this.client) {
        const res = await this.client.ping();
        return res === 'PONG';
      }
      const res = await (this.client as UpstashRedis).ping();
      return res === 'PONG';
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error);
      this.logger.error('Redis ping failed', msg);
      return false;
    }
  }
}
