// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';

import { Logger as PinoLogger } from 'nestjs-pino';
import helmet from 'helmet';

import { AppModule } from './app.module';

import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: true,
  });

  // Logger de Pino
  app.useLogger(app.get(PinoLogger));

  // Configuración de Payload (Subida de archivos/JSON grandes)
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Seguridad Headers
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 5000;
  await app.listen(port);

  await app.listen(process.env.PORT);

  const logger = new Logger('Bootstrap');

  logger.log(`App is running on ${await app.getUrl()}`);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  console.error(error);
  process.exit(1);
}

process.on('uncaughtException', handleError);
