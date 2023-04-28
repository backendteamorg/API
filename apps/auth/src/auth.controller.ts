import { Controller, Get ,Body,Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from 'apps/microservices/src/jwt-auth.guard';
import { ApiProperty } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @MessagePattern({ cmd: 'get-title'})
  async getTitle(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return 'AuthService'
  }

  
  @MessagePattern({ cmd: 'get-users'})
  async getUser(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.authService.getAllUsers();
  }
  @MessagePattern({ cmd: 'registration' })
  async register(@Ctx() context: RmqContext, @Payload() newUser: AuthDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.authService.registration(newUser);
  }

  @MessagePattern({ cmd: 'login' })
  async login(
    @Ctx() context: RmqContext,
    @Payload() existingUser: AuthDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.authService.login(existingUser);
  }
  @MessagePattern({ cmd: 'get-user' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() user: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.authService.getOneUser(user.id);
  }
  
}
