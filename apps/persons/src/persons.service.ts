import { Injectable,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Persons } from './personofmovie.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PersonsService {
  constructor(@InjectModel(Persons) private personsRepository:typeof Persons,
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
      const personsREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=\
persons.id%20persons.photo%20persons.name%20persons.enName%20persons.profession%20persons.enProfession%20id&limit=1000)`, {
        method: 'GET',
        headers:{
                  'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                  'Content-Type': 'application/json',
                },
    })
    if(personsREQ.ok){
      let json = await personsREQ.json();
      let arrPersons = []
      for(let i = 0 ;i < json.docs.length;i++){
          for(let j = 0 ;j<json.docs[i].persons.length;j++){
            await arrPersons.push(
            {
              movieid:json.docs[i].id,
              personid:json.docs[i].persons[j].id,
              name:json.docs[i].persons[j].name,
              enName:json.docs[i].persons[j].enName,
              photo:json.docs[i].persons[j].photo,
              profession:json.docs[i].persons[j].profession,
              enProfession:json.docs[i].persons[j].enProfession,

            }
            )
          }
      }
      return await this.personsRepository.bulkCreate(arrPersons)
 
       
    }
    else{
      console.log("Ошибка HTTP: " + personsREQ.status);
    }
        
      }
  }
  async getAllPersons(){
    return await this.personsRepository.findAll()
  }
}
