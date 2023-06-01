import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { CommentsModule } from './comments.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(CommentsModule, {
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'comment_queue',
          queueOptions: {
            durable: false
          },
        },
    });
  
    await app.listen();

  }

bootstrap();