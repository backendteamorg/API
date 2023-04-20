import { Injectable } from '@nestjs/common';

@Injectable()
export class CountriesService {
  getHello(): string {
    return 'Hello World!';
  }
}
