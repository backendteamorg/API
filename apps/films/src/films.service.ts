import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Films } from './films.model';
import { FilmDto } from './dto/film.dto';
import { Op } from 'sequelize';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import e from 'express';

@Injectable()
export class FilmsService {
    constructor(@InjectModel(Films) private filmRepository: typeof Films,
    @Inject('GENRES_SERVICE') private rabbitGenresFilmsService: ClientProxy,
    @Inject('COUNTRIES_SERVICE') private rabbitCountriesFilmsService: ClientProxy,
    @Inject('NAMESOFFILMS_SERVICE') private rabbitNamesOfFilmsService: ClientProxy,
    @Inject('WHATCHABILITY_SERVICE') private rabbitwatchabilityService: ClientProxy,
    @Inject('FACTSOFFILMS_SERVICE') private rabbitfactsoffilmsService: ClientProxy,
    @Inject('PRODUCRCOMPANIES_SERVICE') private rabbitProductionCompaniesFilmsService: ClientProxy,
    @Inject('SPOKENLANGUAGE_SERVICE') private rabbitSpokenLanguageService: ClientProxy,
    @Inject('VIDEOS_SERVICE') private rabbitVideosService: ClientProxy,
    @Inject('SEQUEILANDPRIQUELS_SERVICE') private rabbitequelsequelsandprequelsService: ClientProxy,
    @Inject('NAMESOFGENRES_SERVICE') private rabbitnamesofGenresService: ClientProxy,
    @Inject('PERSONS_SERVICE') private rabbitPersonsFilmsService: ClientProxy) {}


    async getAllGenresOfMovies(){
        const ob$ = await this.rabbitGenresFilmsService.send({
            cmd: 'get-all-genres',
          },
          {});
          const genres = await firstValueFrom(ob$).catch((err) => console.error(err));
          return genres;
    }

    async getAllNamesOfGenres(){
        const ob$ = await this.rabbitnamesofGenresService.send({
            cmd: 'get-namesofgenres',
          },
          {});
          const namesofgenres = await firstValueFrom(ob$).catch((err) => console.error(err));
          return namesofgenres;
    }

    async getAllPersonsOfMovies(){
        const ob$ = await this.rabbitPersonsFilmsService.send({
            cmd: 'get-all-persons',
          },
          {});
          const persons = await firstValueFrom(ob$).catch((err) => console.error(err));
          return persons;
    }

    async getAllCountriesOfMovies(){
        const ob$ = await this.rabbitCountriesFilmsService.send({
            cmd: 'get-all-countries',
          },
          {});
          const countries = await firstValueFrom(ob$).catch((err) => console.error(err));
          return countries;
    }

    async getAllNamesOfFilms(){
        const ob$ = await this.rabbitNamesOfFilmsService.send({
            cmd: 'get-all-namesoffilms',
          },
          {});
          const namesoffilms = await firstValueFrom(ob$).catch((err) => console.error(err));
          return namesoffilms;
    }

    async getAllWhatchabilityOfFilms(){
        const ob$ = await this.rabbitwatchabilityService.send({
            cmd: 'get-all-watchability',
          },
          {});
          const whatchability = await firstValueFrom(ob$).catch((err) => console.error(err));
          return whatchability;
    }

    async getAllFactsOfFilms(){
        const ob$ = await this.rabbitfactsoffilmsService.send({
            cmd: 'get-all-facts',
          },
          {});
          const facts = await firstValueFrom(ob$).catch((err) => console.error(err));
          return facts;
    }

    async getAllProductionCompaniesOfFilms(){
        const ob$ = await this.rabbitProductionCompaniesFilmsService.send({
            cmd: 'get-all-productioncompanies',
          },
          {});
          const productioncompanies = await firstValueFrom(ob$).catch((err) => console.error(err));
          return productioncompanies;
    }

    async getAllSpokenLanguageOfFilms(){
        const ob$ = await this.rabbitSpokenLanguageService.send({
            cmd: 'get-all-spoken-langeage',
          },
          {});
          const spokenLanguage = await firstValueFrom(ob$).catch((err) => console.error(err));
          return spokenLanguage;
    }

    async getAllVideosOfFilms(){
        const ob$ = await this.rabbitVideosService.send({
            cmd: 'get-all-videos',
          },
          {});
          const videos = await firstValueFrom(ob$).catch((err) => console.error(err));
          return videos;
    }

    async getAllSequelsAndPrequelsOfFilms(){
        const ob$ = await this.rabbitequelsequelsandprequelsService.send({
            cmd: 'get-all-sequelsandprequels',
          },
          {});
          const sequelsandprequels = await firstValueFrom(ob$).catch((err) => console.error(err));
          return sequelsandprequels;
    }


    async getAllFilmsWithAllInfo(){
        const films = await this.filmRepository.findAll()
        const genres = await this.getAllGenresOfMovies()
        const namesofgenres = await this.getAllNamesOfGenres()
        const countries = await this.getAllCountriesOfMovies()
        const namesofmovies = await this.getAllNamesOfFilms()
        const whatchability = await this.getAllWhatchabilityOfFilms()
        const facts = await this.getAllFactsOfFilms()
        const productioncompanies = await this.getAllProductionCompaniesOfFilms()
        const spokenLanguage = await this.getAllSpokenLanguageOfFilms()
        const persons = await this.getAllPersonsOfMovies()
        const videos = await this.getAllVideosOfFilms()
        const sequelsandprequels = await this.getAllSequelsAndPrequelsOfFilms()
        let ArrFilms = []
        
        for(let q = 0 ; q < films.length;q++){
            let ArrGenresId = []
            for(let w = 0 ; w < genres.length;w++){
                if(genres[w].movieid===films[q].id){
                    ArrGenresId.push(genres[w].genreid)
                }
            }
            let ArrNamesOfGenres = []
            for(let w = 0 ; w < namesofgenres.length;w++){
                for(let e = 0 ; e < ArrGenresId.length;e++){
                    if(namesofgenres[w].id===ArrGenresId[e]){
                        ArrNamesOfGenres.push(
                            {
                                name:namesofgenres[w].genre,
                                enName:namesofgenres[w].enName
                            }
                            )
                    }
                }
            }
            let ArrCountries = []
            for(let w = 0 ;w<countries.length;w++){
                if(countries[w].movieid===films[q].id){
                    ArrCountries.push({name:countries[w].country})
                }
            }
            let ArrNamesofFilms = []
            for(let w = 0 ;w<namesofmovies.length;w++){
                if(namesofmovies[w].movieid===films[q].id){
                    ArrNamesofFilms.push(
                        {
                            name:namesofmovies[w].name,
                            language:namesofmovies[w].language,
                            type:namesofmovies[w].type
                        }
                        )
                }
            }
            let ArrWhatchability = []
            for(let w = 0 ;w<whatchability.length;w++){
                if(whatchability[w].movieid===films[q].id){
                    ArrWhatchability.push(
                        {
                            name:whatchability[w].name,
                            logo:whatchability[w].logo,
                            url:whatchability[w].url,
                            
                        }
                        )
                }
            }
            let ArrFacts = []
            for(let w = 0 ;w<facts.length;w++){
                if(facts[w].movieid===films[q].id){
                    ArrFacts.push(
                        {
                            value:facts[w].value,
                            type:facts[w].type,
                            spoiler:facts[w].spoiler
                        }
                        )
                }
            }
            let ArrProductionCompanies = []
            for(let w = 0 ;w<productioncompanies.length;w++){
                if(productioncompanies[w].movieid===films[q].id){
                    ArrProductionCompanies.push(
                        {
                            name:productioncompanies[w].name,
                            url:productioncompanies[w].url,
                            previewUrl:productioncompanies[w].previewUrl,
                        }
                        )
                }
            }
            let ArrSpokenLanguages = []
            for(let w = 0 ;w<spokenLanguage.length;w++){
                if(spokenLanguage[w].movieid===films[q].id){
                    ArrSpokenLanguages.push(
                        {
                            name:spokenLanguage[w].name,
                            nameEn:spokenLanguage[w].nameEn,
                        }
                        )
                }
            }
            let ArrPersonsOfMovies = []
            for(let w = 0 ;w<persons.length;w++){
                if(persons[w].movieid===films[q].id){
                    ArrPersonsOfMovies.push(
                        {
                            personid:persons[w].personid,
                            name:persons[w].name,
                            enName:persons[w].enName,
                            photo:persons[w].photo,
                            profession:persons[w].profession,
                            enProfession:persons[w].enProfession,
                        }
                        )
                }
            }
            let ArrVideos = []
            for(let w = 0 ;w<videos.length;w++){
                if(videos[w].movieid===films[q].id){
                    ArrVideos.push(
                        {
                            url:videos[w].url,
                            name:videos[w].name,
                            site:videos[w].site,
                            type:videos[w].type,
                        }
                        )
                }
            }
            let ArrSequelsAndPrequels = []
            for(let w = 0 ;w<sequelsandprequels.length;w++){
                if(sequelsandprequels[w].movieid===films[q].id){
                    ArrSequelsAndPrequels.push(
                        {
                            sequelsAndPrequelsID:sequelsandprequels[w].sequelsAndPrequelsID,
                            name:sequelsandprequels[w].name,
                            enName:sequelsandprequels[w].enName,
                            alternativeName:sequelsandprequels[w].alternativeName,
                            type:sequelsandprequels[w].type,
                            posterurl:sequelsandprequels[w].posterurl,
                            posterpreviewUrl:sequelsandprequels[w].posterpreviewUrl,
                        }
                        )
                }
            }
            ArrFilms.push(
                {
                    film:films[q],
                    genres:ArrNamesOfGenres,
                    countries:ArrCountries,
                    namesoffilm:ArrNamesofFilms,
                    whatchability:ArrWhatchability,
                    facts:ArrFacts,
                    productionCompanies:ArrProductionCompanies,
                    spokenLanguage:ArrSpokenLanguages,
                    persons:ArrPersonsOfMovies,
                    videos:ArrVideos,
                    sequelsAndPrequels:ArrSequelsAndPrequels    
                }
                )
            
        }


        return ArrFilms
    }   






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
    let FilmArr = []
    let RepfIMS = await this.filmRepository.findAll()
    for(let i = 0 ; i < RepfIMS.length;i++){
        FilmArr.push(RepfIMS[i].id)
    }
    if(movieREQ.ok){
        let json = await movieREQ.json();
        let arrMovies = []
        for(let i = 0; i <json.docs.length;i++){
            if((FilmArr.includes(json.docs[i].id))===false){
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
        }
        return await this.filmRepository.bulkCreate(arrMovies)
        
      }
      else{
        console.log("Ошибка HTTP: " + movieREQ.status);
      }

    }
    

    

    async getGenresByMovieId(id:number){
        const ob$ = await this.rabbitGenresFilmsService.send({
          cmd: 'get-genres-by-moveid',
        },
        {id:id});
        const genres = await firstValueFrom(ob$).catch((err) => console.error(err));
        return genres;
    }

    async getCountriesByMovieId(id:number){
        const ob$ = await this.rabbitCountriesFilmsService.send({
          cmd: 'get-countries-by-movieid',
        },
        {id:id});
        const countries = await firstValueFrom(ob$).catch((err) => console.error(err));
        return countries;
    }
    async getNamesOfFilmsByMovieId(id:number){
        const ob$ = await this.rabbitNamesOfFilmsService.send({
          cmd: 'get-namesOfFilms-by-moveid',
        },
        {id:id});
        const namesofmovies = await firstValueFrom(ob$).catch((err) => console.error(err));
        return namesofmovies;
    }
    async getWhatchabilityByMovieId(id:number){
        const ob$ = await this.rabbitwatchabilityService.send({
          cmd: 'get-watchability-by-moveid',
        },
        {id:id});
        const whatchability = await firstValueFrom(ob$).catch((err) => console.error(err));
        return whatchability;
    }
    async getFactsByMovieId(id:number){
        const ob$ = await this.rabbitfactsoffilmsService.send({
          cmd: 'get-facts-by-moveid',
        },
        {id:id});
        const facts = await firstValueFrom(ob$).catch((err) => console.error(err));
        return facts;
    }
    async getProductCompaniesByMovieId(id:number){
        const ob$ = await this.rabbitProductionCompaniesFilmsService.send({
          cmd: 'get-productionCompanies-by-moveid',
        },
        {id:id});
        const productioncompanies = await firstValueFrom(ob$).catch((err) => console.error(err));
        return productioncompanies;
    }
    async getSpokenLanguageByMovieId(id:number){
        const ob$ = await this.rabbitSpokenLanguageService.send({
          cmd: 'get-spokenLanguages-by-moveid',
        },
        {id:id});
        const spokenLanguage = await firstValueFrom(ob$).catch((err) => console.error(err));
        return spokenLanguage;
    }
    async getPersonsByMovieId(id:number){
        const ob$ = await this.rabbitPersonsFilmsService.send({
          cmd: 'get-personsoffilms-by-moveid',
        },
        {id:id});
        const persons = await firstValueFrom(ob$).catch((err) => console.error(err));
        return persons;
    }
    async getVideosByMovieId(id:number){
        const ob$ = await this.rabbitVideosService.send({
          cmd: 'get-videos-by-moveid',
        },
        {id:id});
        const videos = await firstValueFrom(ob$).catch((err) => console.error(err));
        return videos;
    }
    async getSequelsAndPrequelsByMovieId(id:number){
        const ob$ = await this.rabbitequelsequelsandprequelsService.send({
          cmd: 'get-sequelsAndPrequels-by-moveid',
        },
        {id:id});
        const sequelsandprequels = await firstValueFrom(ob$).catch((err) => console.error(err));
        return sequelsandprequels;
    }

    async getFilmById(idF:number){
        const film = await this.filmRepository.findOne({where:{id:idF}})
        const genres = await this.getGenresByMovieId(idF)
        const namesofgenres = await this.getAllNamesOfGenres()
        const countries = await this.getCountriesByMovieId(idF)
        const namesofmovies = await this.getNamesOfFilmsByMovieId(idF)
        const whatchability = await this.getWhatchabilityByMovieId(idF)
        const facts = await this.getFactsByMovieId(idF)
        const productioncompanies = await this.getProductCompaniesByMovieId(idF)
        const spokenLanguage = await this.getSpokenLanguageByMovieId(idF)
        const persons = await this.getPersonsByMovieId(idF)
        const videos = await this.getVideosByMovieId(idF)
        const sequelsandprequels = await this.getSequelsAndPrequelsByMovieId(idF)


        let ArrNamesOfGenres = []
        for(let w = 0 ; w < namesofgenres.length;w++){
            for(let e = 0 ; e < genres.length;e++){
                if(namesofgenres[w].id===genres[e].genreid){
                    ArrNamesOfGenres.push(
                        {
                            name:namesofgenres[w].genre,
                            enName:namesofgenres[w].enName
                        }
                        )
                }
            }
        }


        let ArrCountries = []
        for(let w = 0 ; w< countries.length; w++){
            ArrCountries.push({name:countries[w].country})
        
        }

        let ArrNamesofFilms = []
        for(let w = 0 ; w< namesofmovies.length; w++){
            ArrNamesofFilms.push(
                {
                    name:namesofmovies[w].name,
                    language:namesofmovies[w].language,
                    type:namesofmovies[w].type
                }
                )
            
        }
        let ArrWhatchability = []
        for(let w = 0 ;w<whatchability.length;w++){
            ArrWhatchability.push(
                    {
                        name:whatchability[w].name,
                        logo:whatchability[w].logo,
                        url:whatchability[w].url,
                            
                    }
                        )
                
        }
        let ArrFacts = []
        for(let w = 0 ;w<facts.length;w++){
            ArrFacts.push(
                    {
                        value:facts[w].value,
                        type:facts[w].type,
                        spoiler:facts[w].spoiler
                    }
                    )
            
        }
        let ArrProductionCompanies = []
        for(let w = 0 ;w<productioncompanies.length;w++){
           ArrProductionCompanies.push(
                        {
                            name:productioncompanies[w].name,
                            url:productioncompanies[w].url,
                            previewUrl:productioncompanies[w].previewUrl,
                        }
                        )
                
        }
        let ArrSpokenLanguages = []
            for(let w = 0 ;w<spokenLanguage.length;w++){
                ArrSpokenLanguages.push(
                        {
                            name:spokenLanguage[w].name,
                            nameEn:spokenLanguage[w].nameEn,
                        }
                        )
                
        }
        let ArrPersonsOfMovies = []
            for(let w = 0 ;w<persons.length;w++){
                ArrPersonsOfMovies.push(
                        {
                            personid:persons[w].personid,
                            name:persons[w].name,
                            enName:persons[w].enName,
                            photo:persons[w].photo,
                            profession:persons[w].profession,
                            enProfession:persons[w].enProfession,
                        }
                        )
                
        }
        let ArrVideos = []
            for(let w = 0 ;w<videos.length;w++){
                ArrVideos.push(
                        {
                            url:videos[w].url,
                            name:videos[w].name,
                            site:videos[w].site,
                            type:videos[w].type,
                        }
                        )
                
            }
            let ArrSequelsAndPrequels = []
            for(let w = 0 ;w<sequelsandprequels.length;w++){
                    ArrSequelsAndPrequels.push(
                        {
                            sequelsAndPrequelsID:sequelsandprequels[w].sequelsAndPrequelsID,
                            name:sequelsandprequels[w].name,
                            enName:sequelsandprequels[w].enName,
                            alternativeName:sequelsandprequels[w].alternativeName,
                            type:sequelsandprequels[w].type,
                            posterurl:sequelsandprequels[w].posterurl,
                            posterpreviewUrl:sequelsandprequels[w].posterpreviewUrl,
                        }
                        )
            }
        return {
            film:film,
            genres:ArrNamesOfGenres,
            countries:ArrCountries,
            namesOfFilms:ArrNamesofFilms,
            whatchability:ArrWhatchability,
            facts:ArrFacts,
            productioncompanies:ArrProductionCompanies,
            spokenLanguage:ArrSpokenLanguages,
            persons:ArrPersonsOfMovies,
            videos:ArrVideos,
            sequelsandprequels:ArrSequelsAndPrequels
            
            
        }
    }
















    async updateNameMovie(dto:FilmDto){
        const film =  await this.filmRepository.findOne({where: {id: dto.id}})
        film.name = dto.name
        film.save()
        return film

    }

    async getMoviesByRating(rating:number){
        return await this.filmRepository.findAll({
            where:{
                ratingkp:{
                    [Op.gte]:rating
                }
            }
        }
        )
    }

    async getMoviesByVotesKinopoisk(votes:number){
        return await this.filmRepository.findAll({
            where:{
                voteskp:{
                    [Op.gte]:votes
                }
            }
        }
        )
    }

    async SortByVotesKp(){
        let Arrfilm = []
        const  films = await this.filmRepository.findAll()
        for(let i = 0 ;i<films.length;i++ ){
            Arrfilm.push(films[i])
        }
        return Arrfilm.sort((a, b) => b.voteskp - a.voteskp)
    }

    async SortByRatingKp(){
        let Arrfilm = []
        const  films = await this.filmRepository.findAll()
        for(let i = 0 ;i<films.length;i++ ){
            Arrfilm.push(films[i])
        }
        return Arrfilm.sort((a, b) => b.ratingkp - a.ratingkp)
    }

    async SortByDate(){
        let Arrfilm = []
        const  films = await this.filmRepository.findAll()
        for(let i = 0 ;i<films.length;i++ ){
            Arrfilm.push(films[i])
        }
        return Arrfilm.sort((a, b) => b.year - a.year)
    }

    async SortByName(){
        let Arrfilm = []
        const  films = await this.filmRepository.findAll()
        for(let i = 0 ;i<films.length;i++ ){
            Arrfilm.push(films[i])
        }
        return Arrfilm.sort((a, b) => {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
          
            // names must be equal
            return 0;
          });
    }
}