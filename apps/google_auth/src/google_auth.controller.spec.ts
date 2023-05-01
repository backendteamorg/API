import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthController } from './google_auth.controller';
import { GoogleAuthService } from './google_auth.service';

describe('GoogleAuthController', () => {
  let googleAuthController: GoogleAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GoogleAuthController],
      providers: [GoogleAuthService],
    }).compile();

    googleAuthController = app.get<GoogleAuthController>(GoogleAuthController);
  });

  
});
