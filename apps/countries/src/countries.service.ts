import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CountriesOfFilms } from './counties.model';
import { ClientProxy } from '@nestjs/microservices';
import { asyncScheduler, firstValueFrom } from 'rxjs';
@Injectable()
export class CountriesService {
    constructor(@InjectModel(CountriesOfFilms) private countriesRepository: typeof CountriesOfFilms,
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
          const countriesREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=countries&selectFields=id&limit=1000)`, {
            method: 'GET',
            headers:{
                      'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                      'Content-Type': 'application/json',
                    },
        })
        if(countriesREQ.ok){
          let json = await countriesREQ.json();
          let arrCountries = []
          for(let i =0;i<json.docs.length;i++){
            for(let j =0;j<json.docs[i].countries.length;j++){
              await arrCountries.push(
              {
                movieid:json.docs[i].id,
                country:json.docs[i].countries[j].name
              }
              )
            }
          }
          return this.countriesRepository.bulkCreate(arrCountries)
        }
        else{
          console.log("Ошибка HTTP: " + countriesREQ.status);
        }
            
          }
      }
    async getAllCountries(){
      await this.countriesRepository.findAll()
    }
}
