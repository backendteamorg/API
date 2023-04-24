import { Test, TestingModule } from '@nestjs/testing';
import { ProductionCompaniesController } from './production-companies.controller';
import { ProductionCompaniesService } from './production-companies.service';

describe('ProductionCompaniesController', () => {
  let productionCompaniesController: ProductionCompaniesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductionCompaniesController],
      providers: [ProductionCompaniesService],
    }).compile();

    productionCompaniesController = app.get<ProductionCompaniesController>(ProductionCompaniesController);
  });

  
});
