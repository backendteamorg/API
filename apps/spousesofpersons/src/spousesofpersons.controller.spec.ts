import { Test, TestingModule } from '@nestjs/testing';
import { SpousesofpersonsController } from './spousesofpersons.controller';
import { SpousesofpersonsService } from './spousesofpersons.service';

describe('SpousesofpersonsController', () => {
  let spousesofpersonsController: SpousesofpersonsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SpousesofpersonsController],
      providers: [SpousesofpersonsService],
    }).compile();

    spousesofpersonsController = app.get<SpousesofpersonsController>(SpousesofpersonsController);
  });

 
});
