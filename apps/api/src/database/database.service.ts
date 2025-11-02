import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  constructor(private readonly ds: DataSource) {}

  async onModuleInit() {
    await this.ds.query('SELECT 1');
    this.logger.log('✅ Database Postgres connected');
  }
}
