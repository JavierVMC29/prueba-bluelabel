// src/database/providers/mysql.provider.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class MysqlDdProvider implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<'string'>('MYSQL_HOST'),
      port: parseInt(this.configService.get<'string'>('MYSQL_PORT')),
      username: this.configService.get<'string'>('MYSQL_USER'),
      password: this.configService.get<'string'>('MYSQL_PASSWORD'),
      database: this.configService.get<'string'>('MYSQL_DATABASE'),
      autoLoadEntities: true,
      synchronize: false, //! Keep this as false even during development. Use migrations instead. Check the README.
      logging: false,
    };
  }
}
