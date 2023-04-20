import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Persons } from './person.model';
import { PersonDto } from './dto/createPersonsFilm.dto';

@Injectable()
export class PersonsService {
  constructor(@InjectModel(Persons) private personsRepository){}
  async createPersonsFilm(dto:PersonDto){
    return await this.personsRepository.create(dto)
  }
}
