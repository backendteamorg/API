import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Videos } from './videos.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VideosService {
    constructor(@InjectModel(Videos) private videosRepository:typeof Videos,
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
      const genresREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=id%20videos&\
&limit=1000)`, {
        method: 'GET',
        headers:{
                  'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                  'Content-Type': 'application/json',
                },
    })
    if(genresREQ.ok){
      let json = await genresREQ.json();
      let arrSpokenLanguage = []
      for(let i = 0;i<json.docs.length;i++){
        for(let j = 0;j<json.docs[i].videos.trailers.length;j++){
          await arrSpokenLanguage.push(
            {
              movieid: json.docs[i].id,
              url: json.docs[i].videos.trailers[j].url,
              name: json.docs[i].videos.trailers[j].name,
              site:json.docs[i].videos.trailers[j].site,
              type:json.docs[i].videos.trailers[j].type
            }
            )
        }
      }
      return await this.videosRepository.bulkCreate(arrSpokenLanguage)
    }
    else{
      console.log("Ошибка HTTP: " + genresREQ.status);
    }
}
  }
}