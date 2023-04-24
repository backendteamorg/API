import { Controller, Get } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleDto } from './dto/role.dto';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @MessagePattern({ cmd: 'create-role' })
  async register(@Ctx() context: RmqContext, @Payload() newRole: RoleDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.rolesService.createRole(newRole);
  }
  @MessagePattern({ cmd: 'get-role' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() role: {value:string}, ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.rolesService.getRoleByValue(role.value);
  }
}
