import { Injectable } from '@nestjs/common';
import { RoleDto } from './dto/role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleRepository: typeof Role){}
  
  async createRole(dto: RoleDto) {
    const role = await this.roleRepository.create(dto);
    return role;
}

async getRoleByValue(valueReq: string) {
    const role = await this.roleRepository.findOne({where: {value:valueReq}})
    return role;
}
}
