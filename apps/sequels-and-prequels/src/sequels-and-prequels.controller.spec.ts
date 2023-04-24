import { Test, TestingModule } from '@nestjs/testing';
import { SequelsAndPrequelsController } from './sequels-and-prequels.controller';
import { SequelsAndPrequelsService } from './sequels-and-prequels.service';

describe('SequelsAndPrequelsController', () => {
  let sequelsAndPrequelsController: SequelsAndPrequelsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SequelsAndPrequelsController],
      providers: [SequelsAndPrequelsService],
    }).compile();

    sequelsAndPrequelsController = app.get<SequelsAndPrequelsController>(SequelsAndPrequelsController);
  });

 
});
