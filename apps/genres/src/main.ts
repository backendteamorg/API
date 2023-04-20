import { NestFactory } from '@nestjs/core';
import { GenresModule } from './genres.module';

async function bootstrap() {
  const app = await NestFactory.create(GenresModule);
  await app.listen(3000);
}
bootstrap();
