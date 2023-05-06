import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SequelsandPrequeils } from './sequelsAndPrequels.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SequelsAndPrequelsService {
  constructor(@InjectModel(SequelsandPrequeils) private sequilesandProquelsRepository: typeof SequelsandPrequeils,
  @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy){}


  async getAllFilms() {
    const ob$ = await this.rabbitFilmsService.send({
      cmd: 'get-all-films',
    },
    {});
    const films = await firstValueFrom(ob$).catch((err) => console.error(err));
    return films;
  }

  async getSequelsAndPrequelsByMovieId(idM:number){
    return await this.sequilesandProquelsRepository.findAll({where:{movieid:idM}})
  }


  async formDatabase() {
    let Arrfilm = await this.getAllFilms()
    let filmIdArr = [];
    for(let i = 0; i<Arrfilm.length;i++){
      filmIdArr.push(Arrfilm[i].id);
    }
    let SeqRep = await this.sequilesandProquelsRepository.findAll()
    let ArrSeq  = []
    for(let i = 0; i<SeqRep.length;i++){
      ArrSeq.push(SeqRep[i].movieid+' '+SeqRep[i].sequelsAndPrequelsID);
    }
    if(filmIdArr.length!=0){
      const genresREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=id%20sequelsAndPrequels\
&limit=1000)`, {
        method: 'GET',
        headers:{
                  'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                  'Content-Type': 'application/json',
                },
    })
    if(genresREQ.ok){
      let json = await genresREQ.json();
      let arrsequilesandProquels = []
      for(let i =0;i<json.docs.length;i++){
        for(let j=0;j<json.docs[i].sequelsAndPrequels.length;j++){
          if((ArrSeq.includes(json.docs[i].id+' '+json.docs[i].sequelsAndPrequels[j].id))===false){
            await arrsequilesandProquels.push(
              {
                movieid:json.docs[i].id,
                sequelsAndPrequelsID:json.docs[i].sequelsAndPrequels[j].id,
                name:json.docs[i].sequelsAndPrequels[j].name,
                enName:json.docs[i].sequelsAndPrequels[j].enName,
                alternativeName:json.docs[i].sequelsAndPrequels[j].alternativeName,
                type:json.docs[i].sequelsAndPrequels[j].type,
                posterurl:json.docs[i].sequelsAndPrequels[j].poster.url,
                posterpreviewUrl:json.docs[i].sequelsAndPrequels[j].poster.previewUrl,
              }
              )
          }
        }
      }
      return await this.sequilesandProquelsRepository.bulkCreate(arrsequilesandProquels)
} 
}
}
}
