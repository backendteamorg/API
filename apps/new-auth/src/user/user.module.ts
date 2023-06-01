import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Token } from './token.model';
import { AuthController } from './auth.controller';

@Module({
  imports:[SequelizeModule.forFeature([User, Token])],
  controllers: [UserController, AuthController],
  providers: [UserService]
})
export class UserModule {}
