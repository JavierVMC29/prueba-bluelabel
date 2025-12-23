// src/app.module.ts
import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [CoreModule, HealthModule, UsersModule],
})
export class AppModule {}
