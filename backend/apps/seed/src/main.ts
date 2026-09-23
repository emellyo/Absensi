import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module.js';
import { SeedService } from './seed.service.js';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: ['log', 'warn', 'error'],
  });

  try {
    await app.get(SeedService).run();
  } catch (error) {
    new Logger('Seed').error((error as Error).message);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

void bootstrap();
