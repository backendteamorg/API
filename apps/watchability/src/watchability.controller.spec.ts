import { Test, TestingModule } from '@nestjs/testing';
import { WatchabilityController } from './watchability.controller';
import { WatchabilityService } from './watchability.service';

describe('WatchabilityController', () => {
  let watchabilityController: WatchabilityController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WatchabilityController],
      providers: [WatchabilityService],
    }).compile();

    watchabilityController = app.get<WatchabilityController>(WatchabilityController);
  });

 
});
