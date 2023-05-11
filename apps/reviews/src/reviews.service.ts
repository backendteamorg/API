import { Injectable,Inject } from '@nestjs/common';
import { ReviewsOfMovies } from './reviews.model';
import { InjectModel } from '@nestjs/sequelize';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ReviewsOfMoviesDto } from './dto/reviews.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ReviewsCommentOfMoviesDto } from './dto/reviews.comment.dto';
import { ReviewsCommentsOfMovies } from './reviews.comment.model';

@Injectable()
export class ReviewsService {
    constructor(@InjectModel(ReviewsOfMovies) private reviewsRepository:typeof ReviewsOfMovies,
    @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy,
    @Inject('AUTH_SERVICE') private rabbitAuthService: ClientProxy,
    private jwtService: JwtService,
    @InjectModel(ReviewsCommentsOfMovies) private reviewsCommentRepository: typeof ReviewsCommentsOfMovies){}
  

    async getAllReviews(){
      await this.reviewsRepository.findAll()
    }


    async getAllFilms() {
      const ob$ = await this.rabbitFilmsService.send({
        cmd: 'get-all-films',
      },
      {});
      const films = await firstValueFrom(ob$).catch((err) => console.error(err));
      return films;
    }


    

    async postReview(dto:ReviewsOfMoviesDto){
      const film = await this.getAllFilms()
      const filmArr = []
      for(let i = 0 ; i < film.length;i++){
        filmArr.push(film[i].id)
      }
      if(filmArr.length===0){
        return "База фильмов пуста"
      }
      else if((filmArr.includes(dto.movieid))===false){
        return 'Фильма с указанным id нету в базе'
      }
      else{
        return await this.reviewsRepository.create(dto)
      }
    }

    async postReviewComment(dto:ReviewsCommentOfMoviesDto){
      const review = await this.reviewsRepository.findOne({where:{id:dto.reviewid}})
      return this.reviewsCommentRepository.create({...dto,reviewid:review.id})
    }

}
