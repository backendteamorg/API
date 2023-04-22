import { Controller, Get } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}
  @Get()
  @MessagePattern({ cmd: 'parser-countries'})
  async getCountries(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.countriesService.formDatabase()
  }
  @Get()
  @MessagePattern({ cmd: 'get-all-countries'})
  async getAllCountries(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.countriesService.formDatabase()
  }
  
}
