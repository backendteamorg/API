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
  async formDatabase() {
    let arrPersons = []
    for(let i = 0 ; i<(await this.getAllPersons()).length;i++){
      if(arrPersons.includes((await this.getAllPersons()).personid)){
        i++
      }
      else{
        arrPersons.push((await this.getAllPersons())[i].personid)
      }
    }
    return arrPersons
  }

}
