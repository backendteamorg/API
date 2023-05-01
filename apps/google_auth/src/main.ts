import { NestFactory } from '@nestjs/core';
import { GoogleAuthModule } from './google_auth.module';

async function bootstrap() {
  const app = await NestFactory.create(GoogleAuthModule);
  await app.listen(3000);
}
bootstrap();
