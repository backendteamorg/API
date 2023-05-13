import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WatchabilityOfMovies } from './watchability.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WatchabilityService {
  constructor(@InjectModel(WatchabilityOfMovies) private watchabilityRepository: typeof WatchabilityOfMovies,
  @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy){}


  async getAllFilms() {
    const ob$ = await this.rabbitFilmsService.send({
      cmd: 'get-all-films',
    },
    {});
    const films = await firstValueFrom(ob$).catch((err) => console.error(err));
    return films;
  }

  async getAllWhatchability(){
    return await this.watchabilityRepository.findAll()
  }
  async getWatchabilityByMovieId(idM:number){
    return await this.watchabilityRepository.findAll({where:{movieid:idM}})
  }
  
  async formDatabase() {
    let FilmsArr = await this.getAllFilms()
    let filmIdArr = [];
    for(let i = 0; i<FilmsArr.length;i++){
      filmIdArr.push(FilmsArr[i].id);
    }
    let WatchRep = await this.watchabilityRepository.findAll()
    let ArrWatch = []
    for(let i = 0; i<WatchRep.length;i++){
      ArrWatch.push(WatchRep[i].movieid+' '+WatchRep[i].name);
    }
    if(filmIdArr.length!=0){
      const watchabilityREQ = await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=watchability%20id&limit=1000)`, {
        method: 'GET',
        headers:{
                  'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                  'Content-Type': 'application/json',
                },
    })
    if(watchabilityREQ.ok){
      let json = await watchabilityREQ.json();
      let arrWhatchability = []
      for(let n =0; n < json.docs.length;n++){
        if(json.docs[n].watchability.items)
        for(let m=0; m < json.docs[n].watchability.items.length;m++){
          if((ArrWatch.includes(json.docs[n].id+' '+json.docs[n].watchability.items[m].name))===false){
            await arrWhatchability.push(
              {
                movieid:json.docs[n].id,
                name:json.docs[n].watchability.items[m].name,
                logo:json.docs[n].watchability.items[m].logo?.url,
                url:json.docs[n].watchability.items[m].url
              }
              )
          }
        }
      }
     return await this.watchabilityRepository.bulkCreate(arrWhatchability)
 
       
    }
    else{
      console.log("Ошибка HTTP: " + watchabilityREQ.status);
    }
        
     }
  }
}
