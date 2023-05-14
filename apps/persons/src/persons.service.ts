import { Injectable,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Persons } from './personofmovie.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Op } from 'sequelize';

@Injectable()
export class PersonsService {
  constructor(@InjectModel(Persons) private personsRepository:typeof Persons,
  @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy,
  @Inject('PERSONQWE_SERVICE') private rabbitePersonService: ClientProxy,
  @Inject('SPOSES_OF_PERSONQWE_SERVICE') private rabbitesSpousesPersonService: ClientProxy){}


  async getAllFilms() {
    const ob$ = await this.rabbitFilmsService.send({
      cmd: 'get-all-films',
    },
    {});
    const films = await firstValueFrom(ob$).catch((err) => console.error(err));
    return films;
  }
  async getPerson() {
    const ob$ = await this.rabbitePersonService.send({
      cmd: 'get-all-person-profile',
    },
    {});
    const person = await firstValueFrom(ob$).catch((err) => console.error(err));
    return person;
  }
  async getSpousesOfPerson() {
    const ob$ = await this.rabbitesSpousesPersonService.send({
      cmd: 'get-all-sposes-of-person',
    },
    {});
    const spouses = await firstValueFrom(ob$).catch((err) => console.error(err));
    return spouses;
  }
  
  async getAllPersonsWithAllInfo(){
    const persnsoffilms = await this.personsRepository.findAll()
    const person = await  this.getPerson()
    const spouses = await this.getSpousesOfPerson()
    let ArrPersons = []
    for(let q = 0 ; q<person.length;q++ ){
      let ArrPersonsFIlms = []
      for(let w = 0 ; w <persnsoffilms.length;w++){
        if(person[q].id===persnsoffilms[w].personid){
          ArrPersonsFIlms.push({
            movieid:persnsoffilms[w].movieid,
            profession:persnsoffilms[w].profession,
            enProfession:persnsoffilms[w].enProfession,

          })
        }
      }

      let ArrSpouses = []
      for(let w = 0 ; w < spouses.length;w++){
        if(person[q].id===spouses[w].personid){
          ArrSpouses.push({
            sposesid:spouses[w].sposesid,
            name:spouses[w].name,
            divorced:spouses[w].divorced,
            divorcedReason:spouses[w].divorcedReason,
            sex:spouses[w].sex,
            children:spouses[w].children,
            relation:spouses[w].relation,
          })
        }
      }
      
      
      ArrPersons.push({
        person:person[q],
        movies:ArrPersonsFIlms,
        spouses:ArrSpouses

      })
    }

    return ArrPersons
  }

  async getPersonById(id:number){
    const ob$ = await this.rabbitePersonService.send({
      cmd: 'get-person-by-id',
    },
    {id:id});
    const person = await firstValueFrom(ob$).catch((err) => console.error(err));
    return person;
}
async getSpousesBypersonId(id:number){
  const ob$ = await this.rabbitesSpousesPersonService.send({
    cmd: 'get-spousesofperson-by-id',
  },
  {id:id});
  const spouses = await firstValueFrom(ob$).catch((err) => console.error(err));
  return spouses;
}

  async getAllInfoOfPersonsByPersonId(idP:number){
    const persnsoffilms = await this.personsRepository.findAll({where:{personid:idP}})
    const person = await this.getPersonById(idP)
    const spouses = await this.getSpousesBypersonId(idP)
    let ArrMovies =[]
    for(let q =0 ; q <persnsoffilms.length;q++){
      ArrMovies.push({
        movieid:persnsoffilms[q].movieid,
        profession:persnsoffilms[q].profession,
        enProfession:persnsoffilms[q].enProfession,
      })
    }
    let ArrSpouses = []
    for(let q = 0 ; q < spouses.length;q++){
      ArrSpouses.push({
        sposesid:spouses[0].sposesid,
        name:spouses[0].name,
        divorced:spouses[0].divorced,
        divorcedReason:spouses[0].divorcedReason,
        sex:spouses[0].sex,
        children:spouses[0].children,
        relation:spouses[0].relation,
      })
    }
    let ArrPerson = []
    ArrPerson.push({
      person:person,
      movies:ArrMovies,
      spouses:ArrSpouses
    })
    return ArrPerson
  }



  async getAllInfoOfPersonsByMovieId(idM:number){

  }




  async getPersonsOfMovieByMovieId(idP:number){
    return await this.personsRepository.findAll({where:{movieid:idP}})
  }

  async formDatabase() {
    let arrfilm = await this.getAllFilms()
    let filmIdArr = [];
    for(let i = 0; i<arrfilm.length;i++){
      filmIdArr.push(arrfilm[i].id);
    }
    let ArrPersonRep = await this.personsRepository.findAll()
    let ArrPersons = []
    for(let i = 0; i<ArrPersonRep.length;i++){
      ArrPersons.push(ArrPersonRep[i].personid);
    }
    if(filmIdArr.length!=0){
      const personsREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=\
persons.id%20persons.photo%20persons.name%20persons.enName%20persons.profession%20persons.enProfession%20id&limit=100)`, {
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
            if((ArrPersons.includes(json.docs[i].persons[j].id))===false)
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

  async getAllMoviesByDirector(director:string){
    return await this.personsRepository.findAll({where:{
      [Op.and]:
      [
        {[Op.or]:[{profession:'режиссеры'},{enProfession:'director'}]},
        {[Op.or]:[{name:{[Op.like]:director+'%'}},{enName:{[Op.like]:director+'%'}}]}
      ],
    }});

  }

  async getAllMoviesByActor(actor:string){
    return await this.personsRepository.findAll({where:{
      [Op.and]:
      [
        {[Op.or]:[{profession:'актеры'},{enProfession:'actor'}]},
        {[Op.or]:[{name:{[Op.like]:actor+'%'}},{enName:{[Op.like]:actor+'%'}}]}
      ],
    }});

  }
}
