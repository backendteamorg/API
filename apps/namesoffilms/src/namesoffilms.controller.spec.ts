import { Test, TestingModule } from '@nestjs/testing';
import { NamesoffilmsController } from './namesoffilms.controller';
import { NamesoffilmsService } from './namesoffilms.service';

describe('NamesoffilmsController', () => {
  let namesoffilmsController: NamesoffilmsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NamesoffilmsController],
      providers: [NamesoffilmsService],
    }).compile();

    namesoffilmsController = app.get<NamesoffilmsController>(NamesoffilmsController);
  });

 
});
