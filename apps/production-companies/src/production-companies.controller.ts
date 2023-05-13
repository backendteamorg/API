import { Controller, Get } from '@nestjs/common';
import { ProductionCompaniesService } from './production-companies.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class ProductionCompaniesController {
  constructor(private readonly productionCompaniesService: ProductionCompaniesService) {}
  
  @MessagePattern({ cmd: 'parser-productioncompanies'})
  async getProductionCompaniess(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.productionCompaniesService.formDatabase()
  }

  @MessagePattern({ cmd: 'get-all-productioncompanies'})
  async getAllProductionCompanies(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.productionCompaniesService.getAllProductionCompanies()
  }

  @MessagePattern({ cmd: 'get-productionCompanies-by-moveid' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() movie: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.productionCompaniesService.getProductionCompaniesByMovieId(movie.id);
  }
}
