import { Controller, Get, Inject } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ProfileDto } from './dto/profile.dto';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService,
) {}

  
  @MessagePattern({ cmd: 'get-title'})
  async getTitle(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return 'ProfileService';
  }
  @MessagePattern({ cmd: 'create-profile' })
  async CreateProfile(
    @Ctx() context: RmqContext,
    @Payload() existingUser: ProfileDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.profileService.createProfile(existingUser);
  }
  @MessagePattern({ cmd: 'update-profile' })
  async UpdateDprofile(
    @Ctx() context: RmqContext,
    @Payload() existingUser: ProfileDto) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.profileService.updateProfil(existingUser);
  }

  @MessagePattern({ cmd: 'get-profiles'})
  async getProfile(@Ctx() context: RmqContext){
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return await this.profileService.getProfiles();
  }
  @MessagePattern({ cmd: 'get-profile' })
  async getUserById(
    @Ctx() context: RmqContext,
    @Payload() profile: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.profileService.getProfileByUserId(profile.id);
  }
  @MessagePattern({ cmd: 'delete-profile' })
  async deletePorfile(
    @Ctx() context: RmqContext,
    @Payload() profile: { id: number },) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);

    return this.profileService.deleteProfile(profile.id);
  }
  
}
