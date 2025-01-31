import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session'); // nestjs tsconfig 설정 때문에 commonjs 방식으로 import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['aaaaaa'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 선언된 속성이 아니면 body에 포함되지 않음
    }),
  );

  await app.listen(3000);
}
bootstrap();
