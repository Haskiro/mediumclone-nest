import { ValidationPipe } from '@nestjs/common';

if (!process.env.IS_TS_NODE) {
  require('module-alias/register'); // eslint-disable-line @typescript-eslint/no-require-imports
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
