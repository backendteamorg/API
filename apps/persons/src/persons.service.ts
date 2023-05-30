import { Injectable,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Persons } from './personofmovie.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Op, where } from 'sequelize';


@Injectable()
export class PersonsService {
  constructor(@InjectModel(Persons) private personsRepository:typeof Persons,
  @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy,){}


  async getAllFilms() {
    const ob$ = await this.rabbitFilmsService.send({
      cmd: 'get-all-films',
    },
    {});
    const films = await firstValueFrom(ob$).catch((err) => console.error(err));
    return films;
  }

  
  async getAllPersonsWithAllInfo(){
   const persons =  await this.personsRepository.findAll()
   let ArrPersons = []
  let ArrPeronsId = []
    for(let q = 0; q < persons.length;q++){
      if(ArrPeronsId.includes(persons[q].personid)===false){
        ArrPersons.push(persons[q])
        ArrPeronsId.push(persons[q].personid)
      }
    }
    let ArrPersonWithMovies = []
   for(let q=0;q<ArrPersons.length;q++ ){
    let ArrPersonFilms = []
    for(let w = 0; w <persons.length;w++){
      if((ArrPersons[q].personid===persons[w].personid)&&(ArrPersonFilms.includes(persons[w].movieid)===false)){
        ArrPersonFilms.push(persons[w].movieid)
       
      }
    }

    
   
    ArrPersonWithMovies.push({
      id:ArrPersons[q].personid,
      name:ArrPersons[q].name,
      enName:ArrPersons[q].enName,
      photo:ArrPersons[q].photo,
      movies:ArrPersonFilms
    })

   }
    return ArrPersonWithMovies
    
    
  }
  

  async getAllInfoOfPersonsByPersonId(idP:number){
    const persons = await this.personsRepository.findAll({where:{personid:idP}})
    let ArrPersons = []
  let ArrPeronsId = []
    for(let q = 0; q < persons.length;q++){
      if(ArrPeronsId.includes(persons[q].personid)===false){
        ArrPersons.push(persons[q])
        ArrPeronsId.push(persons[q].personid)
      }
    }
    let ArrPersonWithMovies = []
   for(let q=0;q<ArrPersons.length;q++ ){
    let ArrPersonFilms = []
   
    for(let w = 0; w <persons.length;w++){
      if((ArrPersons[q].personid===persons[w].personid)&&(ArrPersonFilms.includes(persons[w].movieid)===false)){
        ArrPersonFilms.push(persons[w].movieid)
       
      }
    }
    let ArrPersonProfession = []
    let ArrEnProfession = []
    for(let w = 0; w <persons.length;w++){
      if((ArrPersons[q].personid===persons[w].personid)&&(ArrPersonProfession.includes(persons[w].profession)===false)){
        ArrPersonProfession.push(persons[w].profession)
        ArrEnProfession.push(persons[w].enProfession)
       
      }
    }

   
    ArrPersonWithMovies.push({
      id:ArrPersons[q].personid,
      name:ArrPersons[q].name,
      enName:ArrPersons[q].enName,
      photo:ArrPersons[q].photo,
      profession:ArrPersonProfession,
      enProfession:ArrEnProfession,
      movies:ArrPersonFilms
    })

   }
    return ArrPersonWithMovies
    
  }



  async getPersonsByMoviesId(moviesid:number[]){
    return await this.personsRepository.findAll({where:{movieid:{[Op.in]:moviesid}}})

   
  }


async getAllDirectors(){
  const persons = await this.personsRepository.findAll({where: {[Op.or]:[{profession:'режиссеры'},{enProfession:'director'}]}})
  let ArrPersons = []
  let ArrPeronsId = []
    for(let q = 0; q < persons.length;q++){
      if(ArrPeronsId.includes(persons[q].personid)===false){
        ArrPersons.push(persons[q])
        ArrPeronsId.push(persons[q].personid)
      }
    }
    let ArrPersonWithMovies = []
   for(let q=0;q<ArrPersons.length;q++ ){
    let ArrPersonFilms = []
   
    for(let w = 0; w <persons.length;w++){
      if((ArrPersons[q].personid===persons[w].personid)&&(ArrPersonFilms.includes(persons[w].movieid)===false)){
        ArrPersonFilms.push(persons[w].movieid)
       
      }
    }
    let ArrPersonProfession = []
    let ArrEnProfession = []
    for(let w = 0; w <persons.length;w++){
      if((ArrPersons[q].personid===persons[w].personid)&&(ArrPersonProfession.includes(persons[w].profession)===false)){
        ArrPersonProfession.push(persons[w].profession)
        ArrEnProfession.push(persons[w].enProfession)
       
      }
    }

   
    ArrPersonWithMovies.push({
      id:ArrPersons[q].personid,
      name:ArrPersons[q].name,
      enName:ArrPersons[q].enName,
      photo:ArrPersons[q].photo,
      profession:ArrPersonProfession,
      enProfession:ArrEnProfession,
      movies:ArrPersonFilms
    })

   }
    return ArrPersonWithMovies
}
async getAllActors(){
  const persons = await this.personsRepository.findAll({where: {[Op.or]:[{profession:'актеры'},{enProfession:'actor'}]}})
  let ArrPersons = []
  let ArrPeronsId = []
    for(let q = 0; q < persons.length;q++){
      if(ArrPeronsId.includes(persons[q].personid)===false){
        ArrPersons.push(persons[q])
        ArrPeronsId.push(persons[q].personid)
      }
    }
    let ArrPersonWithMovies = []
   for(let q=0;q<ArrPersons.length;q++ ){
    let ArrPersonFilms = []
   
    for(let w = 0; w <persons.length;w++){
      if((ArrPersons[q].personid===persons[w].personid)&&(ArrPersonFilms.includes(persons[w].movieid)===false)){
        ArrPersonFilms.push(persons[w].movieid)
       
      }
    }
    let ArrPersonProfession = []
    let ArrEnProfession = []
    for(let w = 0; w <persons.length;w++){
      if((ArrPersons[q].personid===persons[w].personid)&&(ArrPersonProfession.includes(persons[w].profession)===false)){
        ArrPersonProfession.push(persons[w].profession)
        ArrEnProfession.push(persons[w].enProfession)
       
      }
    }

   
    ArrPersonWithMovies.push({
      id:ArrPersons[q].personid,
      name:ArrPersons[q].name,
      enName:ArrPersons[q].enName,
      photo:ArrPersons[q].photo,
      profession:ArrPersonProfession,
      enProfession:ArrEnProfession,
      movies:ArrPersonFilms
    })

   }
    return ArrPersonWithMovies
}

  async getPersonsOfMovieByMovieId(id:number){
    const allPersons = await this.personsRepository.findAll()
    const persons = await this.personsRepository.findAll({where:{movieid:id}})
    let ArrPersons = []
  let ArrPeronsId = []
    for(let q = 0; q < persons.length;q++){
      if(ArrPeronsId.includes(persons[q].personid)===false){
        ArrPersons.push(persons[q])
        ArrPeronsId.push(persons[q].personid)
      }
    }
  let ArrPersonWithMovies = []
   for(let q=0;q<ArrPersons.length;q++ ){
    let ArrPersonFilms = []
    for(let w =0;w<allPersons.length;w++){
      if((ArrPersons[q].personid===allPersons[w].personid)&&(ArrPersonFilms.includes(allPersons[w].movieid)===false)){
        ArrPersonFilms.push(allPersons[w].movieid)
      }
    }
    let ArrPersonProfession = []
    let ArrEnProfession = []
    for(let w = 0; w <persons.length;w++){
      if((ArrPersons[q].personid===persons[w].personid)&&(ArrPersonProfession.includes(persons[w].profession)===false)){
        ArrPersonProfession.push(persons[w].profession)
        ArrEnProfession.push(persons[w].enProfession)
       
      }
    }
    ArrPersonWithMovies.push({
      id:ArrPersons[q].personid,
      name:ArrPersons[q].name,
      enName:ArrPersons[q].enName,
      photo:ArrPersons[q].photo,
      profession:ArrPersonProfession,
      enProfession:ArrEnProfession,
      movies:ArrPersonFilms.length
    })
   
   }
    return ArrPersonWithMovies
    
  }

  async formDatabase() {
    let arrfilm = await this.getAllFilms()
    let filmIdArr = [];
    for(let i = 0; i<arrfilm.length;i++){
      filmIdArr.push(arrfilm[i].id);
    }
    let ArrPersonRep = await this.personsRepository.findAll()
    let ArrPersonsRep = []
    for(let i = 0; i<ArrPersonRep.length;i++){
      ArrPersonsRep.push(ArrPersonRep[i].movieid+'@'+ArrPersonRep[i].personid);
    }
    if(filmIdArr.length!=0){
      const personsREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=\
persons.id%20persons.photo%20persons.name%20persons.enName%20persons.profession%20persons.enProfession%20id`, {
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
            if(ArrPersonsRep.includes(json.docs[i].id+'@'+json.docs[i].persons[j].id)===false){
              arrPersons.push(
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
      }
      return await this.personsRepository.bulkCreate(arrPersons)
 
       
    }
    else{
      console.log("Ошибка HTTP: " + personsREQ.status);
    }
        
      }
  }
  async getAllPersons(){
    const persnsoffilms = await this.personsRepository.findAll()
    const person = await this.personsRepository.findAll()
    let ArrPersons = []
    for(let q = 0 ; q<person.length;q++ ){
      let ArrPersonsFIlms = []
      for(let w = 0 ; w <persnsoffilms.length;w++){
        if(person[q].id===persnsoffilms[w].personid){
          ArrPersonsFIlms.push({
            movieid:persnsoffilms[w].movieid
          })
        }
      }

      
      
      
      ArrPersons.push({
        person:person[q],
        movies:ArrPersonsFIlms,
        

      })
    }

    return ArrPersons
  }


  async getMoviesByDirectorAndActor(str:string){
    const director = str.split("@")[0]
    const actor = str.split("@")[1]
    const ArrDirector = await this.personsRepository.findAll({where:{
      [Op.and]:[  {[Op.or]:[{profession:'режиссеры'},{enProfession:'director'}]},  {[Op.or]:[{name:{[Op.like]:director+'%'}},{enName:{[Op.like]:director+'%'}}]}],
    }});
    const ArrActor = await this.personsRepository.findAll({where:{
      [Op.and]: [   {[Op.or]:[{profession:'актеры'},{enProfession:'actor'}]},   {[Op.or]:[{name:{[Op.like]:actor+'%'}},{enName:{[Op.like]:actor+'%'}}]}   ],
    }}
    );
    
    let ArrDirecrotAndActor = []
    
    if((ArrDirector.length!=0)&&(ArrActor.length!=0)){
      for(let q = 0 ; q < ArrDirector.length;q++){
        for(let w = 0 ; w <ArrActor.length;w++){
          if(ArrDirector[q].movieid===ArrActor[w].movieid){
            ArrDirecrotAndActor.push(
              {
                director:ArrDirector[q],
                actor: ArrActor[w],
                movieid:ArrDirector[q].movieid
              }
              )
          }
        }
    }
    
    }
    return ArrDirecrotAndActor
  }

  async getAllMoviesByDirector(director:string){
    return await this.personsRepository.findAll({where:{
      [Op.and]:[   {[Op.or]:[{profession:'режиссеры'},{enProfession:'director'}]},  {[Op.or]:[{name:{[Op.like]:director+'%'}},{enName:{[Op.like]:director+'%'}}]}],
    }});

  }

  async getAllMoviesByActor(actor:string){
    return await this.personsRepository.findAll({where:{
      [Op.and]: [   {[Op.or]:[{profession:'актеры'},{enProfession:'actor'}]},   {[Op.or]:[{name:{[Op.like]:actor+'%'}},{enName:{[Op.like]:actor+'%'}}]}],
    }}
    );

  }
  
}