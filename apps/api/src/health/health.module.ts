import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class HealthModule {}
