import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { LoggingServiceModule } from './logging-service.module.js';

async function bootstrap() {
  const app = await NestFactory.create(LoggingServiceModule);
  const config = app.get(ConfigService);

  const port = Number(config.get<string>('LOGGING_PORT', '3001'));
  await app.listen(port);

  new Logger('Bootstrap').log(
    `Logging service siap, menunggu job dari queue "activity-log" (health: http://localhost:${port}/health)`,
  );
}

void bootstrap();
