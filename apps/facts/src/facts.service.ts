import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FactsOfMovies } from './facts.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, retry } from 'rxjs';

@Injectable()
export class FactsService {
    constructor(@InjectModel(FactsOfMovies) private factsRepository: typeof FactsOfMovies,
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
  let arrFilm = await this.getAllFilms()
   let filmIdArr = [];
   for(let i = 0; i<arrFilm.length;i++){
     filmIdArr.push(arrFilm[i].id);
   }
   if(filmIdArr.length!=0){
    const factsREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=facts%20id&limit=1000)`, {
      method: 'GET',
      headers:{
                'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                'Content-Type': 'application/json',
              },
  })
  if(factsREQ.ok){
    let json = await factsREQ.json();
    let arrFacts = []
    for(let n =0; n < json.docs.length;n++){
      if(json.docs[n].facts){
        for(let m=0; m < json.docs[n].facts.length;m++){
          await arrFacts.push( 
          {
            movieid:json.docs[n].id,
            value:json.docs[n].facts[m].value,
            type:json.docs[n].facts[m].type,
            spoiler:json.docs[n].facts[m].spoiler
          } 
          )
        }

      }
    }
    return await this.factsRepository.bulkCreate(arrFacts)

     
  }
  else{
    console.log("Ошибка HTTP: " + factsREQ.status);
  }
}
}
}
