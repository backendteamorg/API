import { Controller, Get } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller()
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  getHello(): string {
    return this.countriesService.getHello();
  }
}
