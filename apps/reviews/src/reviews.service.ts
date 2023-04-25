import { Injectable,Inject } from '@nestjs/common';
import { ReviewsOfMovies } from './reviews.model';
import { InjectModel } from '@nestjs/sequelize';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReviewsService {
    constructor(@InjectModel(ReviewsOfMovies) private personsRepository:typeof ReviewsOfMovies,
    @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy){}
  
  
    async getAllFilms() {
      const ob$ = await this.rabbitFilmsService.send({
        cmd: 'get-all-films',
      },
      {});
      const films = await firstValueFrom(ob$).catch((err) => console.error(err));
      return films;
    }
    async formDatabase() {
        let arrfilm = await this.getAllFilms()
        let filmIdArr = [];
        for(let i = 0; i<arrfilm.length;i++){
          filmIdArr.push(arrfilm[i].id);
        }
        if(filmIdArr.length!=0){
          const reviewsREQ =  await fetch(`https://api.kinopoisk.dev/v1/review?movie.id=${filmIdArr.join('&movie.id=')}&selectFields=\
movieId%20title%20type%20review%20date%20author%20authorId&limit=1000)`, {
            method: 'GET',
            headers:{
                      'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                      'Content-Type': 'application/json',
                    },
        })
        if(reviewsREQ.ok){
          let json = await reviewsREQ.json();
          let arrReviews = []
          for(let i = 0 ; i < json.docs.length;i++){
            await arrReviews.push(
            {
              movieid: json.docs[i].movieId,
              title:json.docs[i].title,
              type:json.docs[i].type,
              review:json.docs[i].review,
              date:json.docs[i].date,
              author:json.docs[i].author
            }
            )
          }
          return this.personsRepository.bulkCreate(arrReviews)
           
        }
        else{
          console.log("Ошибка HTTP: " + reviewsREQ.status);
        }
            
          }
      }
}
