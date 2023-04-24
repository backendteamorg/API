import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SposesOfPerson } from './sposes.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SpousesofpersonsService {
  constructor(@InjectModel(SposesOfPerson) private personsRepository:typeof SposesOfPerson,
  @Inject('PERSONQWE_SERVICE') private rabbitPesronsService: ClientProxy){}


  async getAllPersons() {
    const ob$ = await this.rabbitPesronsService.send({
      cmd: 'get-all-person-profile',
    },
    {});
    const person = await firstValueFrom(ob$).catch((err) => console.error(err));
    return person;
  }
  async formDatabase() {
    let arrPersons = []
    for(let i = 0 ; i<(await this.getAllPersons()).length;i++){
        arrPersons.push((await this.getAllPersons())[i].id)
    }
    if(arrPersons.length!=0){
      const personREQ =  await fetch(`https://api.kinopoisk.dev/v1/person?id=${arrPersons.join('&id=')}&selectFields=id%20spouses&limit=1000)`, {
        method: 'GET',
        headers:{
                  'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                  'Content-Type': 'application/json',
                },
    })
    if(personREQ.ok){
      let json = await personREQ.json();
      let arrPerson = []
      for(let i = 0 ; i< json.docs.length;i++){
        if(json.docs[i].spouses){
          for(let j = 0;j<json.docs[i].spouses.length;j++){
            await arrPerson.push(
              {
                personid:json.docs[i].id,
                sposesid:json.docs[i].spouses[j]?.id,
                name:json.docs[i].spouses[j]?.name,
                divorced:json.docs[i].spouses[j]?.divorced,
                divorcedReason:json.docs[i].spouses[j]?.divorcedReason,
                sex:json.docs[i].spouses[j]?.sex,
                children:json.docs[i].spouses[j]?.children,
                relation:json.docs[i].spouses[j]?.relation,
              }
              )
          }
        }
      }
      return await this.personsRepository.bulkCreate(arrPerson)
}
  }

}
}
