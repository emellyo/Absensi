import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  mkdirSync(join(process.cwd(), config.get<string>('UPLOAD_DIR', 'uploads')), {
    recursive: true,
  });

  app.setGlobalPrefix('api', { exclude: ['health'] });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: config
      .get<string>('CORS_ORIGINS', 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim()),
    credentials: true,
  });

  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Dexa Absensi WFH API')
        .setDescription(
          'REST API yang dikonsumsi aplikasi karyawan dan aplikasi monitoring HRD',
        )
        .setVersion('1.0')
        .addBearerAuth()
        .build(),
    ),
  );

  const port = Number(config.get<string>('API_PORT', '3000'));
  await app.listen(port);

  new Logger('Bootstrap').log(`API berjalan di http://localhost:${port}/api`);
}

void bootstrap();
