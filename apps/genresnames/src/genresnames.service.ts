import { Injectable,Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { namesGenresOfFilms } from './genresnames.model';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { GenresNamesDto } from './dto/genresnames.dto';

@Injectable()
export class GenresnamesService {
    constructor(@InjectModel(namesGenresOfFilms) private namesofgenresmoviesRepository,
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
        let ArrFilms = await this.getAllFilms()
        let filmIdArr = [];
        for(let i = 0; i<ArrFilms.length;i++){
          filmIdArr.push(ArrFilms[i].id);
        }
        if(filmIdArr.length!=0){
          const genresREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=genres&limit=1000)`, {
            method: 'GET',
            headers:{
                      'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                      'Content-Type': 'application/json',
                    },
        })
        if(genresREQ.ok){
          let json = await genresREQ.json();
          let arrGenres=[]
          for(let i =0; i< json.docs.length;i++){
            for(let j =0; j<json.docs[i].genres.length;j++){
              if((arrGenres.includes(json.docs[i].genres[j].name))===false){
                if((await this.namesofgenresmoviesRepository.findOne({where:{genre:json.docs[i].genres[j].name}}))){
                  j++
                }
                else{
                  await arrGenres.push(
                    
                    json.docs[i].genres[j].name
                    
                    )
                }
            }

            }
          }
          for(let i = 0 ; i < arrGenres.length;i++){
            arrGenres[i] = {genre:arrGenres[i]}
          }
          return this.namesofgenresmoviesRepository.bulkCreate(arrGenres)
        }
        else{
          console.log("Ошибка HTTP: " + genresREQ.status);
        }
            
        }
      }

    async getAllnamesGenres(){
      return await this.namesofgenresmoviesRepository.findAll()
    }
    
    async updateGenre(dto:GenresNamesDto){
      const genre = await this.namesofgenresmoviesRepository.findOne({where:{id:dto.id}})
      genre.genre = dto.genre
      genre.save()
      return genre
    }
}
