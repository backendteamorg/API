import { Injectable } from '@nestjs/common';

@Injectable()
export class VkAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}
