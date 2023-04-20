import { Module } from '@nestjs/common';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';

@Module({
  imports: [],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}