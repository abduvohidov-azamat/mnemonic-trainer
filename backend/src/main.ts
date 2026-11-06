import './env';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Behind one reverse proxy: use the client's IP so auth rate limits stay per visitor.
  app.set('trust proxy', 1);
  app.setGlobalPrefix('api');
  const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200,capacitor://localhost,http://localhost')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🧠 Mnemonic Trainer Backend running at http://localhost:${port}/api`);
}
bootstrap();
