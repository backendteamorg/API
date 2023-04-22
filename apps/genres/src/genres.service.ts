import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenresOfFilms } from './genres.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GenresService {
  constructor(@InjectModel(GenresOfFilms) private genresRepository: typeof GenresOfFilms,
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
    let filmIdArr = [];
    for(let i = 0; i<(await this.getAllFilms()).length;i++){
      filmIdArr.push((await this.getAllFilms())[i].id);
    }
    if(filmIdArr.length!=0){
      const genresREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=genres&selectFields=id&limit=1000)`, {
        method: 'GET',
        headers:{
                  'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                  'Content-Type': 'application/json',
                },
    })
    if(genresREQ.ok){
      let json = await genresREQ.json();
      for(let n =0; n < json.docs.length;n++){
        for(let m=0; m < json.docs[n].genres.length;m++){
          await this.createGenreOfMovies( json.docs[n].genres[m],json.docs[n] )
        }
      }
 
       
    }
    else{
      console.log("Ошибка HTTP: " + genresREQ.status);
    }
        
      }
  }

  async createGenreOfMovies(json,movieID){
     await this.genresRepository.create({...json,movieid:movieID.id,genre:json.name})
    
  }
}
