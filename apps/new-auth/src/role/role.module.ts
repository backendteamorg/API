import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleController } from './role.controller';
import { Role } from './role.model';
import { UserRoles } from './user-roles.model';

@Module({
    imports: [SequelizeModule.forFeature([UserRoles, Role])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService]
})
export class RoleModule {}
