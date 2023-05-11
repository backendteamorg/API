import { Controller, Get } from '@nestjs/common';
import { GoogleAuthService } from './google_auth.service';

@Controller()
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}


  
}
