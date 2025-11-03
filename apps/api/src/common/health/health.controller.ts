import { Controller, Get, Query } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async check() {
    return await this.healthService.check();
  }

  @Get('info')
  getInfo() {
    return this.healthService.getInfo();
  }

  @Get('files')
  async listFiles(@Query('path') path?: string) {
    return await this.healthService.listFiles(path);
  }
}
