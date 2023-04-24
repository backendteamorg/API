import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './roles.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `./apps/roles/.${process.env.NODE_ENV}.env`,
      isGlobal:true
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [Role],
      autoLoadModels: true
    }),
    SequelizeModule.forFeature([Role]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
