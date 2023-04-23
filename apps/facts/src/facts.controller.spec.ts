import { Test, TestingModule } from '@nestjs/testing';
import { FactsController } from './facts.controller';
import { FactsService } from './facts.service';

describe('FactsController', () => {
  let factsController: FactsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FactsController],
      providers: [FactsService],
    }).compile();

    factsController = app.get<FactsController>(FactsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(factsController.getHello()).toBe('Hello World!');
    });
  });
});
