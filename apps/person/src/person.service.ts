import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { firstValueFrom } from 'rxjs';
import { Person } from './person.model';

@Injectable()
export class PersonService {
  constructor(@InjectModel(Person) private personsRepository:typeof Person,
  @Inject('PERSONS_SERVICE') private rabbitPesronsService: ClientProxy){}


  async getAllPersons() {
    const ob$ = await this.rabbitPesronsService.send({
      cmd: 'get-all-persons',
    },
    {});
    const person = await firstValueFrom(ob$).catch((err) => console.error(err));
    return person;
  }
  async getAllPersonProfile(){
    return await this.personsRepository.findAll()
  }
  async formDatabase() {
    let arrPerson = await this.getAllPersons()
    let arrIDPersons = []
    for(let i = 0 ; i<arrPerson.length;i++){
      if(arrIDPersons.includes(arrPerson[i].personid)){
        i++
      }
      else{
        arrIDPersons.push((await this.getAllPersons())[i].personid)
      }
    }
    if(arrIDPersons.length!=0){
      const personREQ =  await fetch(`https://api.kinopoisk.dev/v1/person?id=${arrIDPersons.join('&id=')}&selectFields=id%20name%20enName%20photo%20sex%20\
growth%20birthday%20death%20age%20birthPlace%20deathPlace%20countAwards&limit=1000)`, {
        method: 'GET',
        headers:{
                  'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                  'Content-Type': 'application/json',
                },
    })
    if(personREQ.ok){
      let json = await personREQ.json();
      let arrPerson = []
      for(let i =0; i<json.docs.length;i++){
        let berthpl=[]
        let deathPl=[]
        for( let j = 0 ; j < json.docs[i].birthPlace?.length;j++){
          berthpl.push(json.docs[i].birthPlace[j]?.value)
        }
        for( let j = 0 ; j < json.docs[i].deathPlace?.length;j++){
          deathPl.push(json.docs[i].deathPlace[j]?.value)
        }
        await arrPerson.push(
          {
            id:json.docs[i].id,
            name:json.docs[i].name,
            enName:json.docs[i].enName,
            photo:json.docs[i].photo,
            sex:json.docs[i].sex,
            growth:json.docs[i].growth,
            birthday:json.docs[i].birthday,
            death:json.docs[i].death,
            age:json.docs[i].age,
            birthPlace:berthpl.join(','),
            deathPlace:deathPl.join(','),
            countAwards:json.docs[i].countAwards,
          }
          )
      }
      return this.personsRepository.bulkCreate(arrPerson)
}
  }

}
}
