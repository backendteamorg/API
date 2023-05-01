import { Module } from '@nestjs/common';
import { GoogleAuthController } from './google_auth.controller';
import { GoogleAuthService } from './google_auth.service';

@Module({
  imports: [],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
})
export class GoogleAuthModule {}
