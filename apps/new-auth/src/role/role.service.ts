import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './role.model';

@Injectable()
export class RoleService {
    constructor(@InjectModel(Role) private roleRepo: typeof Role) {}

    async createRole(value: string) {
        const roles = await this.roleRepo.findAll()
        for(let q = 0 ;q <roles.length;q++){
            if(roles[q].value===value){
                return 'Роль уже есть в базе'
            }
        }
        const role = await this.roleRepo.create({value: value});
        return role;
    }

    async getRoleByValue(value: string) {
        const role = await this.roleRepo.findOne({where: {value}});
        return role;
    }

    async getRoles() {
        const roles = await this.roleRepo.findAll({include: {all:true}});
        return roles;
    }
}
