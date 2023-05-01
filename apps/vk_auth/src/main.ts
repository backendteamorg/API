import { NestFactory } from '@nestjs/core';
import { VkAuthModule } from './vk_auth.module';

async function bootstrap() {
  const app = await NestFactory.create(VkAuthModule);
  await app.listen(3000);
}
bootstrap();
