import { Injectable } from '@nestjs/common';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,

    private readonly db: TypeOrmHealthIndicator,
    private readonly redis: RedisService,
  ) {}

  async check() {
    return this.health.check([
      () => ({
        app: { status: 'up' },
      }),

      async () => await this.db.pingCheck('database'),

      async () => {
        const isHealthy = await this.redis.ping();
        return {
          redis: { status: isHealthy ? 'up' : 'down' },
        };
      },
    ]);
  }
}
