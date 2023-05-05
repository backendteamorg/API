import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Films } from './films.model';
import { FilmDto } from './dto/film.dto';


@Injectable()
export class FilmsService {
    constructor(@InjectModel(Films) private filmRepository: typeof Films) {}


  async formDatabase() {
    const movieREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?type=movie&type=cartoon&selectFields=\
fees%20status%20externalId%20rating%20votes%20backdrop%20movieLength%20images%20id%20type%20\
name%20description%20distributors%20\
premiere%20slogan%20year%20budget%20poster%20lists%20typeNumber%20alternativeName%20enName%20ageRating%20\
ratingMpaa%20updateDates%20sequelsAndPrequels%20shortDescription%20technology%20ticketsOnSale%20updatedAt%20imagesInfo%20audience%20logo%20top10%20top250&sortField=votes.kp&sortType=-1&page=1&limit=1000)`, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
            'Content-Type': 'application/json',
        },
    })
    if(movieREQ.ok){
        let json = await movieREQ.json();
        let arrMovies = []
        for(let i = 0; i <json.docs.length;i++){
            await arrMovies.push(
                {
                    feesworld: ''+json.docs[i].fees.world?.value+' '+json.docs[i].fees.world?.currency,
                    feesusa: ''+json.docs[i].fees.usa?.value+' '+json.docs[i].fees.usa?.currency,
                    audience: ''+json.docs[i].audience?.count+' '+json.docs[i].audience?.count,
                    status: json.docs[i].status,
                    externalIdkpHD: json.docs[i].externalId?.kpHD,
                    externalIdimdb: json.docs[i].externalId?.imdb,
                    externalIdtmdb: json.docs[i].externalId?.tmdb,
                    ratingkp: json.docs[i].rating?.kp,
                    ratingimdb: json.docs[i].rating?.imdb,
                    ratingfilmCritics: json.docs[i].rating?.filmCritics,
                    ratingrussianFilmCritics: json.docs[i].rating?.russianFilmCritics,
                    voteskp: json.docs[i].votes?.kp,
                    votesimdb: json.docs[i].votes?.imdb,
                    votesfilmCritics: json.docs[i].votes?.filmCritics,
                    votesrussianFilmCritics: json.docs[i].votes?.russianFilmCritics,
                    backdropurl: json.docs[i].backdrop?.url,
                    backdroppreviewUrl: json.docs[i].backdrop?.previewUrl,
                    movieLength: json.docs[i].movieLength,
                    imagespostersCount: json.docs[i].images?.postersCount,
                    imagesbackdropsCount: json.docs[i].images?.backdropsCount,
                    imagesframesCount: json.docs[i].images?.framesCount,
                    id: json.docs[i].id,
                    type: json.docs[i].type,
                    name: json.docs[i].name,
                    description: json.docs[i].description,
                    distributor: json.docs[i].distributors?.distributor,
                    distributorRelease: json.docs[i].distributors?.distributorRelease,
                    premiereworld: json.docs[i].premiere?.world,
                    premiererussia: json.docs[i].premiere?.russia,
                    premierebluray: json.docs[i].premiere?.bluray,
                    slogan: json.docs[i].slogan,
                    year: json.docs[i].year,
                    budget: ''+json.docs[i].budget?.value + json.docs[i].budget?.currency,
                    posterurl: json.docs[i].poster?.url,
                    posterpreviewUrl: json.docs[i].poster?.previewUrl,
                    typeNumber: json.docs[i].typeNumber,
                    alternativeName: json.docs[i].alternativeName,
                    enName: json.docs[i].enName,
                    ageRating: json.docs[i].ageRating,
                    ratingMpaa: json.docs[i].ratingMpaa,
                    shortDescription: json.docs[i].shortDescription,
                    hasImax: json.docs[i].technology?.hasImax,
                    has3D: json.docs[i].technology?.has3D,
                    ticketsOnSale: json.docs[i].ticketsOnSale,
                    updatedAt: json.docs[i].updatedAt,
                    top10: json.docs[i].top10,
                    top250: json.docs[i].top250,

                    
                }
                )
        }
        return await this.filmRepository.bulkCreate(arrMovies)
        
   
         
      }
      else{
        console.log("Ошибка HTTP: " + movieREQ.status);
      }

    }
    
       

    async getAllFilm(){
        return await this.filmRepository.findAll()
    }
    async getFilmById(idF:number){
        return await this.filmRepository.findOne({where:{id:idF}})
    }

    async updateNameMovie(dto:FilmDto){
        const film =  await this.filmRepository.findOne({where: {id: dto.id}})
        film.name = dto.name
        film.save()
        return film

    }
}