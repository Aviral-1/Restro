import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Minimal .env loader - prioritize root .env
dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config(); // fallback to local

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = process.env.API_PORT || 4000;
  await app.listen(port);
  console.log(`🚀 API RUNNING ON PORT ${port}`);
}

bootstrap().catch(err => {
  console.error("💥 CRASH:", err);
  process.exit(1);
});
