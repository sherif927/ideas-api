import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { LoggingInterceptor } from './shared/logger/logging.interceptor';

async function bootstrap() {
  const port = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'bootstrap');
}

bootstrap();
