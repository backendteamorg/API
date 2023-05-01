import { Module } from '@nestjs/common';
import { VkAuthController } from './vk_auth.controller';
import { VkAuthService } from './vk_auth.service';

@Module({
  imports: [],
  controllers: [VkAuthController],
  providers: [VkAuthService],
})
export class VkAuthModule {}
