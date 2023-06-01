import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { Comment } from './comments.model';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';


@Module({
    imports: [ConfigModule.forRoot({
        envFilePath: `./apps/comments/.${process.env.NODE_ENV}.env`,
        isGlobal:true
      }),
      SequelizeModule.forRoot({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        models: [Comment],
        autoLoadModels: true
      }), SequelizeModule.forFeature([Comment])],
    controllers: [CommentsController],
    providers: [CommentsService]
})
export class CommentsModule {
}