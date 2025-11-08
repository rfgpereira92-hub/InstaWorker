import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.enableCors();
  const port = process.env.PORT || 4000;
  await app.listen(port as number);
  // eslint-disable-next-line no-console
  console.log(`Server running on :${port}`);
}

bootstrap();

