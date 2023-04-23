import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { NamesOfMovies } from './namesoffilms.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NamesoffilmsService {
  constructor(@InjectModel(NamesOfMovies) private namesOfFilmsRepository: typeof NamesOfMovies,
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
     const namesofMoviesREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=names&selectFields=id&limit=1000)`, {
       method: 'GET',
       headers:{
                 'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                 'Content-Type': 'application/json',
               },
   })
   if(namesofMoviesREQ.ok){
     let json = await namesofMoviesREQ.json();
     let arrNamesOfFilms = []
     for(let i =0;i<json.docs.length;i++){
        for(let j =0; j< json.docs[i].names.length;j++){
          await arrNamesOfFilms.push(
            {
              movieid:json.docs[i].id,
              name:json.docs[i].names[j].name,
              language:json.docs[i].names[j].language,
              type:json.docs[i].names[j].type,
              }
              )
        }
     }
     return this.namesOfFilmsRepository.bulkCreate(arrNamesOfFilms)
      
   }
   else{
     console.log("Ошибка HTTP: " + namesofMoviesREQ.status);
   }
       
    }
 }
  
}
