import { Module } from '@nestjs/common';
import { GoogleAuthController } from './google_auth.controller';
import { GoogleAuthService } from './google_auth.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { GoogleUser } from './google.user.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./apps/google_auth/.${process.env.NODE_ENV}.env`,
      isGlobal:true
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [GoogleUser],
      autoLoadModels: true
    }),
    SequelizeModule.forFeature([GoogleUser]),
  ],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
})
export class GoogleAuthModule {}
