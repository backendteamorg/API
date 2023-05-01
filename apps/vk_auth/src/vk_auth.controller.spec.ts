import { Test, TestingModule } from '@nestjs/testing';
import { VkAuthController } from './vk_auth.controller';
import { VkAuthService } from './vk_auth.service';

describe('VkAuthController', () => {
  let vkAuthController: VkAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [VkAuthController],
      providers: [VkAuthService],
    }).compile();

    vkAuthController = app.get<VkAuthController>(VkAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(vkAuthController.getHello()).toBe('Hello World!');
    });
  });
});
