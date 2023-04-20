import { NestFactory } from '@nestjs/core';
import { CountriesModule } from './countries.module';

async function bootstrap() {
  const app = await NestFactory.create(CountriesModule);
  await app.listen(3000);
}
bootstrap();
