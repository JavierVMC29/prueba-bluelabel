/// src/core/core.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { LoggerModule } from 'nestjs-pino';

import { DatabaseModule } from '@src/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Time-to-live in milliseconds
        limit: 60, // Maximum requests per window globally
      },
    ]),

    LoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          req: () => undefined,
          res: () => undefined,
        },
        autoLogging: false,
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: {
                  messageKey: 'message',
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                  singleLine: false,
                },
              },
        messageKey: 'message',
      },
    }),

    DatabaseModule,
  ],
})
export class CoreModule {}
