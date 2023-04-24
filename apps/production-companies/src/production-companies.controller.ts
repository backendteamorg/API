import { Controller, Get } from '@nestjs/common';
import { ProductionCompaniesService } from './production-companies.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';

@Controller()
export class ProductionCompaniesController {
  constructor(private readonly productionCompaniesService: ProductionCompaniesService) {}
  @Get()
  @MessagePattern({ cmd: 'parser-productioncompanies'})
  async getPersons(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.productionCompaniesService.formDatabase()
  }
  
}
