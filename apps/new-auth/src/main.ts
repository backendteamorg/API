import { NestFactory } from '@nestjs/core';
import { NewAuthModule } from './new-auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(NewAuthModule, {
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: false
          },
        },
    });
  
    await app.listen();

  }

bootstrap();