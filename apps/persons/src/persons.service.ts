import { Injectable,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Persons } from './person.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, toArray } from 'rxjs';

@Injectable()
export class PersonsService {
  constructor(@InjectModel(Persons) private personsRepository,
  @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy){}
  async getAllFilms() {
    const ob$ = await this.rabbitFilmsService.send({
      cmd: 'get-all-films',
    },
    {});
    const user = await firstValueFrom(ob$).catch((err) => console.error(err));
    return user;
  }
  async formDatabase() {
    let filmIdArr = [];
    for(let i = 0; i<(await this.getAllFilms()).length;i++){
      filmIdArr.push((await this.getAllFilms())[i].id);
    }
    if(filmIdArr.length!=0){
      
        await fetch(`https://api.kinopoisk.dev/v1/person?movies.id=${filmIdArr.join('&movies.id=')}&selectFields=id%20movies.id%20\
&sortType=-1&page=1&limit=1000)`, {
        method: 'GET',
        headers:{
                  'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                  'Content-Type': 'application/json',
                },
              })
        .then(res => res.json())
        .then(async (json) => {
          for(let i = 0; i < json.length; i++) {
            const persons = await this.personsRepository.create({...json, id:json.id, movieid:json.movies.id})
            return persons
          }})
        .catch(err => console.log(err))
        

    


      
   
  }
  }

}