import { createClient, RedisClientType } from 'redis';
import { Redis as UpstashRedis } from '@upstash/redis';

export type AnyRedisClient = RedisClientType | UpstashRedis;

export async function createRedisClient(): Promise<AnyRedisClient> {
  const isUpstash = !!process.env.UPSTASH_REDIS_REST_URL;

  if (isUpstash) {
    return new UpstashRedis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  const client: RedisClientType = createClient({
    url: process.env.REDIS_URL!,
  });

  client.on('error', (err) => console.error('Redis Client Error:', err));
  await client.connect();

  return client;
}
