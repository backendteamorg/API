import { Controller, Get } from '@nestjs/common';
import { VkAuthService } from './vk_auth.service';

@Controller()
export class VkAuthController {
  constructor(private readonly vkAuthService: VkAuthService) {}

  @Get()
  getHello(): string {
    return this.vkAuthService.getHello();
  }
}
