import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Films } from './films.model';


@Injectable()
export class FilmsService {
    constructor(@InjectModel(Films) private filmRepository: typeof Films,
    @Inject('PERSONS_SERVICE') private personRepository ) {}
    
    async formDatabase() {
        let movieId = 301
        await fetch(`https://api.kinopoisk.dev/v1/movie?id=${movieId}&selectFields=fees&selectFields=status&selectFields=externalId&selectFields=rating&selectFields=votes&selectFields=backdrop&selectFields=movieLength&selectFields=id&selectFields=type&selectFields=name&selectFields=description&selectFields=distributors&selectFields=premiere&selectFields=slogan&selectFields=year&selectFields=budget&selectFields=poster&selectFields=typeNumber&selectFields=enName&selectFields=ageRating&selectFields=ratingMpaa&selectFields=shortDescription&selectFields=technology&selectFields=ticketsOnSale&selectFields=updatedAt&selectFields=top10&selectFields=top250)`, {
            method: 'GET',
            headers: {
                'X-API-KEY': 'QTD9VCR-EW8M0Y4-QR6W0Y1-Y8J1BFT',
                'Content-Type': 'application/json',
            },
        })
        .then(res => res.json())
        .then(async (json) => {
            for(let i = 0; i < json.docs.length; i++) {
               await this.createFilm(json.docs[i]); 
            }
            
        })
        .catch(err => console.log(err))
    }
    async createFilm(json) {
        
        const film = await this.filmRepository.create({...json, feesworld:json.fees?.world?.value,
        feesusa:json.fees?.usa?.value, status:json.status, externalIdkpHD:json.externalId?.kpHD, 
        externalIdimdb:json.externalId?.imdb,externalIdtmdb:json.externalId?.tmdb, 
        ratingkp:json.rating?.kp, ratingimdb:json.rating?.imdb, ratingfilmCritics: json.rating?.filmCritics, 
        ratingrussianFilmCritics: json.rating?.russianFilmCritics, voteskp: json.votes?.kp, votesimdb: json.votes?.imdb,
        votesfilmCritics: json.votes?.filmCritics, votesrussianFilmCritics: json.votes?.russianFilmCritics, backdropurl:json.backdrop?.url,
        backdroppreviewUrl: json.backdrop?.previewUrl, movieLength: json.movieLength,movieid: json.id, type: json.type, 
        name: json.name, description: json.description, distributor: json.distributors?.distributor,  distributorRelease: json.distributors?.distributorRelease,
        premiereworld: json.premiere?.world, premiererussia: json.premiere?.russia, premierebluray: json.premiere?.bluray,
        slogan: json.slogan, year: json.year, budget: json.budget?.value, posterurl: json.poster?.url, posterpreviewUrl: json.poster?.previewUrl,
        typeNumber: json.typeNumber, alternativeName: json.alternativeName, enName: json.enName, ageRating: json.ageRating, ratingMpaa: json.ratingMpaa,
        shortDescription: json.shortDescription, hasImax: json.technology?.hasImax, has3D: json.technology?.has3D,ticketsOnSale: json.ticketsOnSale,
        updatedAt: json.updatedAt, top10: json.top10, top25: json.top25 });

            
        return film;
    }
    async getAllFilm(){
        return await this.filmRepository.findAll()
    }
}