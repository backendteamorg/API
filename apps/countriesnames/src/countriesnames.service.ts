import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CountriesNames } from './countries-names.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Op } from 'sequelize';
import { CountriesDto } from './dto/counrtiesnames.dto';

@Injectable()
export class CountriesnamesService {
  constructor(@InjectModel(CountriesNames) private countriesNamesRepository: typeof CountriesNames,
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
    const countriesEnnanes = [{"enName":"France"},{"enName":"Great Britain"},{"enName":"USA"},{"enName":"Russia"},{"enName":"USSR"},{"enName":"Canada"},{"enName":"Germany"},{"enName":"China"},{"enName":"Mexico"},{"enName":"Hungary"},
    {"enName":"Australia"},{"enName":"Sweden"}
  ,{"enName":"Japan"},{"enName":"Malta"},{"enName":"Morocco"},{"enName":"New Zealand"},{"enName":"Jordan"},{"enName":"India"},{"enName":"South Korea"},{"enName":"Hong Kong"}
  ,{"enName":"Belgium"},{"enName":"UAE"},{"enName":"Taiwan"},{"enName":"Spain"},{"enName":"Denmark"},{"enName":"Netherlands"},{"enName":"Italy"},
  {"enName":"Switzerland"},{"enName":"Thailand"},{"enName":"Czech"},{"enName":"Romania"},{"enName":"Poland"},{"enName":"Bulgaria"},{"enName":"Norway"},{"enName":"Singapore"},{"enName":"South Africa"},{"enName":"Belarus"},
  {"enName":"Turkey"},{"enName":"Greece"},{"enName":"Serbia"},{"enName":"Luxembourg"},
  {"enName":"Ukraine"},{"enName":"Finland"},{"enName":"Argentina"},{"enName":"Tunisia"},{"enName":"Bahamas"},{"enName":"Iceland"},{"enName":"Brazil"},{"enName":"Ireland"},{"enName":"Slovenia"},{"enName":"Indonesia"},
  {"enName":"Lebanon"},{"enName":"Cyprus"},{"enName":"Qatar"},{"enName":"Germany (FRG)"},
  {"enName":"Colombia"}]
  let Arrfilm =  await this.getAllFilms()
    let filmIdArr = [];
    let ArrCountries = [] 
    let countries = await this.countriesNamesRepository.findAll()
    for(let q = 0 ;q <countries.length;q++){
      ArrCountries.push(countries[q].name)
    }
    for(let i = 0; i<Arrfilm.length;i++){
      filmIdArr.push(Arrfilm[i].id);
    }
      const countriesnamesREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=countries%20id&limit=1000`, {
        method: 'GET',
        headers:{
                  'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                  'Content-Type': 'application/json',
                },
    })
    if(countriesnamesREQ.ok){
      let json = await countriesnamesREQ.json();
      let arrCountriesNames = []
      for(let q = 0 ; q <json.docs.length;q++){
        for(let w =0;w<json.docs[q].countries.length;w++){
          if((arrCountriesNames.includes(json.docs[q].countries[w].name)===false)&&(ArrCountries.includes(json.docs[q].countries[w].name)===false)){
            arrCountriesNames.push(json.docs[q].countries[w].name)
          }
        }
      }
      let ArrCountriesNames = []
      for(let q = 0 ; q <arrCountriesNames.length;q++){
        ArrCountriesNames.push(
          {
            name:arrCountriesNames[q],
            enName:countriesEnnanes[q].enName
          }
          )
      }
      return await this.countriesNamesRepository.bulkCreate(ArrCountriesNames)
      
    }
    else{
      console.log("Ошибка HTTP: " + countriesnamesREQ.status);
    }
  }
  async getAllCountriesNames(){
    return await this.countriesNamesRepository.findAll()
  }
  async updateCountries(dto:CountriesDto){
    const countries = await this.countriesNamesRepository.findOne({where:{id:dto.id}})
    countries.name = dto.name
    countries.enName = dto.enName
    countries.save()
    return countries

  }
  async getCountriesByNames(ArrCountries:string[]){
    return await this.countriesNamesRepository.findAll({where:{
      [Op.or]:[{name:{[Op.in]:ArrCountries}},{enName:{[Op.in]:ArrCountries}}]
      }})
  }
}
