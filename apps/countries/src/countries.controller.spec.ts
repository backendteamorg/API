import { Test, TestingModule } from '@nestjs/testing';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

describe('CountriesController', () => {
  let countriesController: CountriesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [CountriesService],
    }).compile();

    countriesController = app.get<CountriesController>(CountriesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(countriesController.getHello()).toBe('Hello World!');
    });
  });
});
