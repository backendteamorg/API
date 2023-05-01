import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
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

  const PORT = process.env.PORT 
  const config = new DocumentBuilder()
        .setTitle('Данные с сайта kinopoisk')
        .setDescription('Документация REST API')
        .setVersion('1.0.0')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document)

  await app.listen(PORT, ()=>console.log(`Server started on port = ${PORT}`)) 
}
bootstrap();
