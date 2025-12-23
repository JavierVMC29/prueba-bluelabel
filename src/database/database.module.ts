// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MysqlDdProvider } from './providers/mysql.provider';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'mysql', // Explicitly set the connection name for MySQL
      useClass: MysqlDdProvider,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
