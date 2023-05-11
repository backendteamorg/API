import { NestFactory } from '@nestjs/core';
import { GoogleAuthModule } from './google_auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as session from 'express-session';
import * as passport from 'passport';


async function bootstrap() {
  const app = await NestFactory.create(GoogleAuthModule);
  const configService = app.get(ConfigService)
  const USER = configService.get('RABBITMQ_DEFAULT_USER');
  const PASSWORD =  configService.get('RABBITMQ_DEFAULT_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const QUEUE = configService.get('RABBITMQ_AUTH_GOOGLE_QUEUE');

  app.use(session({
    secret: 'my-secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 600000
    }
  }))
  app.use(passport.initialize());
  app.use(passport.session());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
      noAck:false,
      queue: QUEUE,
      queueOptions: {
        durable: true
      }
    }
  })
  await app.startAllMicroservices();
}
bootstrap();
