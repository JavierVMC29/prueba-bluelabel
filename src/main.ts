// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';

import { Logger as PinoLogger } from 'nestjs-pino';
import helmet from 'helmet';

import { AppModule } from './app.module';

import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  // --- CONFIGURACIÓN SWAGGER (OPENAPI) ---

  const config = new DocumentBuilder()
    .setTitle('Prueba Técnica Backend')
    .setDescription('API RESTful con NestJS, TypeORM y MySQL')
    .setVersion('1.0')
    .addTag('Users', 'Gestión de usuarios y configuraciones')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // La ruta será /docs
  SwaggerModule.setup('docs', app, document);

  // ---------------------------------------

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');

  logger.log(`App running on: ${await app.getUrl()}`);
  logger.log(`Swagger Docs: ${await app.getUrl()}/docs`);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  console.error(error);
  process.exit(1);
}

process.on('uncaughtException', handleError);
