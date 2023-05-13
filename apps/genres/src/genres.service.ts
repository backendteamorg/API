import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GenresOfFilms } from './genres.model';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GenresService {
  constructor(@InjectModel(GenresOfFilms) private genresRepository: typeof GenresOfFilms,
  @Inject('FILM_SERVICE') private rabbitFilmsService: ClientProxy,
  @Inject('NAMESGENRES_SERVICE') private rabbitnamesGenresService: ClientProxy){}

  async getGenresByMovieId(idM:number){
    return await this.genresRepository.findAll({where:{movieid:idM}})
  }

  async getAllFilms() {
    const ob$ = await this.rabbitFilmsService.send({
      cmd: 'get-all-films',
    },
    {});
    const films = await firstValueFrom(ob$).catch((err) => console.error(err));
    return films;
  }

  
  async getAllnamesGenres() {
    const ob$ = await this.rabbitnamesGenresService.send({
      cmd: 'get-namesofgenres',
    },
    {});
    const namesgenres = await firstValueFrom(ob$).catch((err) => console.error(err));
    return namesgenres;
  }
  
  async formDatabase() {

    let ArrFilms = await this.getAllFilms()
    let filmIdArr = [];
    for(let i = 0; i<ArrFilms.length;i++){
      filmIdArr.push(ArrFilms[i].id);
    }

    let ArrNamesGenres = await this.getAllnamesGenres()
    let arrnamesGenres = []
    for(let i = 0; i<ArrNamesGenres.length;i++){
      arrnamesGenres.push(ArrNamesGenres[i]);
    }
    let genreRepArr = []
    let genreRep = await this.genresRepository.findAll()
    for(let i = 0 ; i <genreRep.length;i++ ){
      genreRepArr.push('genreid: '+(genreRep[i].genreid)+' : '+'movieid: '+genreRep[i].movieid)
    }

    if((filmIdArr.length!=0)&&(arrnamesGenres.length!=0)){
      const genresREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?id=${filmIdArr.join('&id=')}&selectFields=genres%20id&limit=1000)`, {
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
          for(let n = 0 ; n<arrnamesGenres.length;n++ ){
            if((arrnamesGenres[n].genre === json.docs[i].genres[j].name)&&(genreRepArr.includes('genreid: '+(arrnamesGenres[n].id)+' : '+'movieid: '+json.docs[i].id)===false)){
                arrGenres.push(
                    {
                      movieid:json.docs[i].id,
                      genreid:arrnamesGenres[n].id
                    }
                    )
                
              
            }
          }
          }
        }
        return await this.genresRepository.bulkCreate(arrGenres)
    }
    else{
      console.log("Ошибка HTTP: " + genresREQ.status);
    }
        
    }
    else{
      return 'DB_FILMS OR DB_NAMES_OF_GENRE IS EMPTY'
    }
  }

  async getAllGenres(){
    return await this.genresRepository.findAll()
  }

  async getMoviesByGenreId(GenreId:number){
    return await this.genresRepository.findAll({where:{genreid:GenreId}})
  }

  
}
