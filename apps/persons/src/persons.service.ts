import { Injectable,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Persons } from './person.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PersonsService {
  constructor(@InjectModel(Persons) private personsRepository,
  @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy){}


  async getAllFilms() {
    const ob$ = await this.rabbitFilmsService.send({
      cmd: 'get-all-films',
    },
    {});
    const films = await firstValueFrom(ob$).catch((err) => console.error(err));
    return films;
  }


  async createPersons(json,movieID){
     await this.personsRepository.create({...json,movieid:movieID.id,photo:json.photo,
      name: json.name,enName: json.enName,profession: json.profession,enProfession: json.enProfession})
      
  }


  async formDatabase() {
    let filmIdArr = [];
    for(let i = 0; i<(await this.getAllFilms()).length;i++){
      filmIdArr.push((await this.getAllFilms())[i].id);
    }
    if(filmIdArr.length!=0){
      const personsREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=\
persons.photo&selectFields=persons.name&selectFields=persons.enName&selectFields=persons.profession&selectFields=persons.enProfession&selectFields=id&limit=1000)`, {
        method: 'GET',
        headers:{
                  'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                  'Content-Type': 'application/json',
                },
    })
    if(personsREQ.ok){
      let json = await personsREQ.json();
      for(let n =0; n < json.docs.length;n++){
        for(let m=0; m < json.docs[n].persons.length;m++){
          await this.createPersons( json.docs[n].persons[m],json.docs[n] )
        }
      }
 
       
    }
    else{
      console.log("Ошибка HTTP: " + personsREQ.status);
    }
        
      }
  }
}
