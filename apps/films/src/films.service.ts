import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Films } from './films.model';
import { FilmDto } from './dto/film.dto';
import { Op } from 'sequelize';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import e from 'express';
import { FilteDto } from './dto/filtre.dto';

@Injectable()
export class FilmsService {
    constructor(@InjectModel(Films) private filmRepository: typeof Films,
    @Inject('GENRES_SERVICE') private rabbitGenresFilmsService: ClientProxy,
    @Inject('COUNTRIES_SERVICE') private rabbitCountriesFilmsService: ClientProxy,
    @Inject('NAMESOFFILMS_SERVICE') private rabbitNamesOfFilmsService: ClientProxy,
    @Inject('VIDEOS_SERVICE') private rabbitVideosService: ClientProxy,
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

   

   

    async getAllVideosOfFilms(){
        const ob$ = await this.rabbitVideosService.send({
            cmd: 'get-all-videos',
          },
          {});
          const videos = await firstValueFrom(ob$).catch((err) => console.error(err));
          return videos;
    }

  


    async getAllFilmsWithAllInfo(){
        const films = await this.filmRepository.findAll()
        const genres = await this.getAllGenresOfMovies()
        const namesofgenres = await this.getAllNamesOfGenres()
        const countries = await this.getAllCountriesOfMovies()
        const namesofmovies = await this.getAllNamesOfFilms()
        
        
        const persons = await this.getAllPersonsOfMovies()
        const videos = await this.getAllVideosOfFilms()
        
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
     
            ArrFilms.push(
                {
                    film:films[q],
                    genres:ArrNamesOfGenres,
                    countries:ArrCountries,
                    namesoffilm:ArrNamesofFilms,
                    persons:ArrPersonsOfMovies,
                    videos:ArrVideos, 
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


    async getFilmById(idF:number){
        const film = await this.filmRepository.findOne({where:{id:idF}})
        const genres = await this.getGenresByMovieId(idF)
        const namesofgenres = await this.getAllNamesOfGenres()
        const countries = await this.getCountriesByMovieId(idF)
        const namesofmovies = await this.getNamesOfFilmsByMovieId(idF)
        const persons = await this.getPersonsByMovieId(idF)
        const videos = await this.getVideosByMovieId(idF)   
        


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
         
        return {
            film:film,
            genres:ArrNamesOfGenres,
            countries:ArrCountries,
            namesOfFilms:ArrNamesofFilms,
            persons:ArrPersonsOfMovies,
            videos:ArrVideos,
            
            
            
        }
    }











    async getAllFilms(){
        return this.filmRepository.findAll()
    }




    async updateNameMovie(dto:FilmDto){
        const film =  await this.filmRepository.findOne({where: {id: dto.id}})
        film.name = dto.name
        film.save()
        return film

    }
///// Фильры ///////////////////////////////////////////////////////////////////////////////////////////////

    async getMoviesByRatingKp(rating:number){
        const films = await this.getAllFilmsWithAllInfo()
        let Arrfilm = []
        for(let i = 0 ;i<films.length;i++ ){
            if(films[i].film.ratingkp>=rating){
                Arrfilm.push(films[i])
            }
            
        }
        return Arrfilm.sort((a, b) => a.film.ratingkp - b.film.ratingkp)
    }
    

    async getMoviesByVotesKinopoisk(votes:number){
        const films = await this.getAllFilmsWithAllInfo()
        let Arrfilm = []
        for(let i = 0 ;i<films.length;i++ ){
            if(films[i].film.voteskp>=votes){
                Arrfilm.push(films[i])
            }
            
        }
        return Arrfilm.sort((a, b) => a.film.voteskp - b.film.voteskp)
        
    }
    async getAllMoviesByDirector(director:string){
        const ob$ = await this.rabbitPersonsFilmsService.send({
            cmd: 'get-movies-by-director',
          },
          {director:director});
          const persons = await firstValueFrom(ob$).catch((err) => console.error(err));
          return persons;
    }
    async getFilmsByDirector(director:string){
        const films = await this.getAllFilmsWithAllInfo()
        const persons = await this.getAllMoviesByDirector(director)
        let ArrFilm = []
        for(let q = 0 ; q < persons.length;q++){
            for(let w = 0 ; w <films.length;w++){
                if(persons[q].movieid===films[w].film.id){
                    ArrFilm.push(films[w])
                }
            }
        }
        return ArrFilm
    }
    async getMoviesByActor(actor:string){
        const ob$ = await this.rabbitPersonsFilmsService.send({
            cmd: 'get-movies-by-actor',
          },
          {actor:actor});
          const persons = await firstValueFrom(ob$).catch((err) => console.error(err));
          return persons;
    }
    async getFilmsByActor(actor:string){
        const films = await this.getAllFilmsWithAllInfo()
        const persons = await this.getMoviesByActor(actor)
        let ArrFilm = []
        for(let q = 0 ; q < persons.length;q++){
            for(let w = 0 ; w <films.length;w++){
                if(persons[q].movieid===films[w].film.id){
                    ArrFilm.push(films[w])
                }
            }
        }
        return ArrFilm
    }


    async getAllMoviesByDirectorAndActor(str:string){
        const ob$ = await this.rabbitPersonsFilmsService.send({
            cmd: 'get-movies-by-director-and-actor',
          },
          {
            str:str,
        }
        );
          const persons = await firstValueFrom(ob$).catch((err) => console.error(err));
          return persons;
    }
    async getFilmsByDirectorActor(str:string){
        const films = await this.getAllFilmsWithAllInfo()
        const persons = await this.getAllMoviesByDirectorAndActor(str)
        let ArrFilm = []
        for(let q = 0 ; q < persons.length;q++){
            for(let w = 0 ; w <films.length;w++){
                if(persons[q].movieid===films[w].film.id){
                    ArrFilm.push(films[w])
                }
            }
        }
        return ArrFilm
    }


    
    async getMoviesGenresByNames(ArrGenres:string[]){
        const ob$ = await this.rabbitnamesofGenresService.send({
            cmd: 'get-genres-by-names',
          },
          {
            ArrGenres:ArrGenres,
        }
        );
          const arrGenres = await firstValueFrom(ob$).catch((err) => console.error(err));
          return arrGenres;
    }
    async getMoviesCountriesByNames(ArrCountries:string[]){
        const ob$ = await this.rabbitCountriesFilmsService.send({
            cmd: 'get-movies-by-countries-names',
          },
          {ArrCountries:ArrCountries});
          const countries = await firstValueFrom(ob$).catch((err) => console.error(err));
          return countries;
    }
 

    async getFilmsByGenreId(genreid:number[]){
        const ob$ = await this.rabbitGenresFilmsService.send({
          cmd: 'get-movies-by-genreid',
        },
        {genreid:genreid});
        const genres = await firstValueFrom(ob$).catch((err) => console.error(err));
        return genres;
    }


    async getGenresByMoviesId(moviesId:number[]){
        const ob$ = await this.rabbitGenresFilmsService.send({
            cmd: 'get-genres-by-moveies-id',
          },
          {moviesId:moviesId});
          const genres = await firstValueFrom(ob$).catch((err) => console.error(err));
          return genres;
    }
    async getCountriesByMoviesId(moviesid:number[]){
        const ob$ = await this.rabbitCountriesFilmsService.send({
            cmd: 'get-countriesofmovie-by-movies-id',
          },
          {moviesid:moviesid});
          const countries = await firstValueFrom(ob$).catch((err) => console.error(err));
          return countries;
    }

    async getNamesOfMoviesByMoviesId(moviesid:number[]){
        const ob$ = await this.rabbitNamesOfFilmsService.send({
            cmd: 'get-namesOfFilms-by-moviesid',
          },
          {moviesid:moviesid});
          const namesofmovies = await firstValueFrom(ob$).catch((err) => console.error(err));
          return namesofmovies;
    }

    async getPersonsOfMoviesByMoviesId(moviesid:number[]){
        const ob$ = await this.rabbitPersonsFilmsService.send({
            cmd: 'get-personsoffilms-by-movesid',
          },
          {moviesid:moviesid});
          const persons = await firstValueFrom(ob$).catch((err) => console.error(err));
          return persons;
    }
    async getVideosOfMoviesByMoviesId(moviesid:number[]){
        const ob$ = await this.rabbitVideosService.send({
            cmd: 'get-videos-by-movesid',
          },
          {moviesid:moviesid});
          const persons = await firstValueFrom(ob$).catch((err) => console.error(err));
          return persons;
    }

    async getFilmsUseFiltre(queryParams:any){
        const ArrFilmId = []
        const {sortField, sortOrder, genres, countries, ratingKp, type, votesKp, page, limit,director,actor} = queryParams; 
        
        
        
        if((queryParams.queryParams.countries!=undefined)&&(queryParams.queryParams.genres===undefined)){        /////////////////////////////////// Страны
 
            const ArrFilmByCountries = [];

            if((typeof(queryParams.queryParams.countries)==='object')){
                const FilmByCountries = await this.getMoviesCountriesByNames(queryParams.queryParams.countries)
                for(let q = 0 ; q <FilmByCountries.length;q++){
                    ArrFilmByCountries.push(FilmByCountries[q].movieid)
                }
                for(let q = 0 ; q < ArrFilmByCountries.length;q++){
                    if(ArrFilmId.includes(ArrFilmByCountries[q])===false){
                        ArrFilmId.push(ArrFilmByCountries[q])
                    }
                }
            }

            else if ((typeof(queryParams.queryParams.countries)==='string')){
                queryParams.queryParams.countries = [queryParams.queryParams.countries]
                const FilmByCountri = await this.getMoviesCountriesByNames(queryParams.queryParams.countries)
                for(let q = 0 ; q <FilmByCountri.length;q++){
                    ArrFilmByCountries.push(FilmByCountri[q].movieid)
                }
                for(let q = 0 ; q < ArrFilmByCountries.length;q++){
                    if(ArrFilmId.includes(ArrFilmByCountries[q])===false){
                        ArrFilmId.push(ArrFilmByCountries[q])
                    }
                }
            }

        }


        if((queryParams.queryParams.genres!=undefined)&&(queryParams.queryParams.countries===undefined)){ ///////////////////////////////// Жанры
 
            let ArrGenreId = []
            if((typeof(queryParams.queryParams.genres)==='object')){
                const FilmByGenres = await this.getMoviesGenresByNames(queryParams.queryParams.genres)
                
                for(let q =0; q <FilmByGenres.length;q++){
                    ArrGenreId.push(FilmByGenres[q].id)
                }
                const arrFilmByGenreId = await this.getFilmsByGenreId(ArrGenreId)
                for(let q = 0 ;q <arrFilmByGenreId.length;q++){
                    if(ArrFilmId.includes(arrFilmByGenreId[q].movieid)===false){
                        ArrFilmId.push(arrFilmByGenreId[q].movieid )
                    }
                }
            }
            else if(typeof(queryParams.queryParams.genres)==='string'){
                queryParams.queryParams.genres = [queryParams.queryParams.genres]
                const FilmByGenres = await this.getMoviesGenresByNames(queryParams.queryParams.genres)
                for(let q =0; q <FilmByGenres.length;q++){
                    ArrGenreId.push(FilmByGenres[q].id)
                }
                const arrFilmByGenreId = await this.getFilmsByGenreId(ArrGenreId)
                for(let q = 0 ;q <arrFilmByGenreId.length;q++){
                    if(ArrFilmId.includes(arrFilmByGenreId[q].movieid)===false){
                        ArrFilmId.push(arrFilmByGenreId[q].movieid)
                    }
                }
            }
        }
        if((queryParams.queryParams.genres!=undefined)&&(queryParams.queryParams.countries!=undefined)){  ////////////////////////////////// Страны, жанры

            let ArrGenres = []
            let ArrGenreId = []
            if((typeof(queryParams.queryParams.genres)==='object')){
                const FilmByGenres = await this.getMoviesGenresByNames(queryParams.queryParams.genres)
                
                for(let q =0; q <FilmByGenres.length;q++){
                    ArrGenreId.push(FilmByGenres[q].id)
                }
                const arrFilmByGenreId = await this.getFilmsByGenreId(ArrGenreId)
                for(let q = 0 ;q <arrFilmByGenreId.length;q++){
                    if(ArrFilmId.includes(arrFilmByGenreId[q].movieid)===false){
                        ArrGenres.push(arrFilmByGenreId[q].movieid )
                    }
                }
            }
            else if(typeof(queryParams.queryParams.genres)==='string'){
                queryParams.queryParams.genres = [queryParams.queryParams.genres]
                const FilmByGenres = await this.getMoviesGenresByNames(queryParams.queryParams.genres)
                for(let q =0; q <FilmByGenres.length;q++){
                    ArrGenreId.push(FilmByGenres[q].id)
                }
                const arrFilmByGenreId = await this.getFilmsByGenreId(ArrGenreId)
                for(let q = 0 ;q <arrFilmByGenreId.length;q++){
                    if(ArrFilmId.includes(arrFilmByGenreId[q].movieid)===false){
                        ArrGenres.push(arrFilmByGenreId[q].movieid)
                    }
                }
            }
            let ArrCountries = []
            let ArrFilmByCountries = [];
            if((typeof(queryParams.queryParams.countries)==='object')){
                const FilmByCountries = await this.getMoviesCountriesByNames(queryParams.queryParams.countries)
                for(let q = 0 ; q <FilmByCountries.length;q++){
                    ArrFilmByCountries.push(FilmByCountries[q].movieid)
                }
                for(let q = 0 ; q < ArrFilmByCountries.length;q++){
                    if(ArrFilmId.includes(ArrFilmByCountries[q])===false){
                        ArrCountries.push(ArrFilmByCountries[q])
                    }
                }
            }

            else if ((typeof(queryParams.queryParams.countries)==='string')){
                queryParams.queryParams.countries = [queryParams.queryParams.countries]
                const FilmByCountri = await this.getMoviesCountriesByNames(queryParams.queryParams.countries)
                for(let q = 0 ; q <FilmByCountri.length;q++){
                    ArrFilmByCountries.push(FilmByCountri[q].movieid)
                }
                for(let q = 0 ; q < ArrFilmByCountries.length;q++){
                    if(ArrFilmId.includes(ArrFilmByCountries[q])===false){
                        ArrCountries.push(ArrFilmByCountries[q])
                    }
                }
            }
            for(let q = 0 ; q <ArrFilmByCountries.length;q++){
                for(let w = 0 ; w<ArrGenres.length;w++){
                    if(ArrFilmByCountries[q]===ArrGenres[w]){
                        ArrFilmId.push(ArrFilmByCountries[q])
                        q++
                    }
                }
            }
        
    }

    let ArrFilms = []
    let films = []
    if(((queryParams.queryParams.countries!=undefined)||(queryParams.queryParams.genres!=undefined))&& ///// жанры или фильмы , рейтиг КП, голоса КП
    (queryParams.queryParams.director===undefined)&&(queryParams.queryParams.actor===undefined)){
        if((queryParams.queryParams.ratingKp===undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{id:{[Op.in]:ArrFilmId}}})
            for(let q = 0 ; q <Flilms.length;q++){
            films.push(Flilms[q])
            }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
                [Op.and]:[{id:{[Op.in]:ArrFilmId}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}}]
            }})
            for(let q = 0 ; q <Flilms.length;q++){
            films.push(Flilms[q])
            }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp!=undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
                [Op.and]:[{id:{[Op.in]:ArrFilmId}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}},{voteskp:{[Op.gte]:queryParams.queryParams.votesKp}}]
            }})
            for(let q = 0 ; q <Flilms.length;q++){
            films.push(Flilms[q])
            }
        }
    }
    else if(((queryParams.queryParams.countries!=undefined)||(queryParams.queryParams.genres!=undefined))&& ///// жанры или фильмы и режисер, рейтиг КП, голоса КП
    (queryParams.queryParams.director!=undefined)&&(queryParams.queryParams.actor===undefined)){
        const persons = await this.getAllMoviesByDirector(queryParams.queryParams.director)
            let ArrFilmswithDirectorId = []
            for(let q = 0 ; q <persons.length;q++ ){
                if(ArrFilmId.includes(persons[q].movieid)){
                    ArrFilmswithDirectorId.push(persons[q].movieid)
                }
            }
        if((queryParams.queryParams.ratingKp===undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{id:{[Op.in]:ArrFilmswithDirectorId}}})
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
            [Op.and]:[{id:{[Op.in]:ArrFilmswithDirectorId}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}}]
            }
            })
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp!=undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
            [Op.and]:[{id:{[Op.in]:ArrFilmswithDirectorId}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}},{voteskp:{[Op.gte]:queryParams.queryParams.votesKp}}]
            }
            })
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }
        
    }
    else if(((queryParams.queryParams.countries!=undefined)||(queryParams.queryParams.genres!=undefined))&& ///// жанры или фильмы и актер , рейтиг КП, голоса КП
    (queryParams.queryParams.director===undefined)&&(queryParams.queryParams.actor!=undefined)){
        const persons = await this.getMoviesByActor(queryParams.queryParams.actor)
        let ArrFilmswithActor = []
        for(let q = 0 ; q <persons.length;q++ ){
            if(ArrFilmId.includes(persons[q].movieid)){
                ArrFilmswithActor.push(persons[q].movieid)
            }
        }
        if((queryParams.queryParams.ratingKp===undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{id:{[Op.in]:ArrFilmswithActor}}})
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
                [Op.and]:[{id:{[Op.in]:ArrFilmswithActor}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}}]
                }
                })
                for(let q = 0 ; q <Flilms.length;q++){
                    films.push(Flilms[q])
                }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp!=undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
            [Op.and]:[{id:{[Op.in]:ArrFilmswithActor}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}},{voteskp:{[Op.gte]:queryParams.queryParams.votesKp}}]
            }
            })
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }


        
        
    }
    else if ((queryParams.queryParams.director!=undefined)&&(queryParams.queryParams.actor===undefined)&&  ///// режисер , рейтиг КП, голоса КП
    (queryParams.queryParams.countries===undefined)&&(queryParams.queryParams.genres===undefined)){
        const persons = await this.getAllMoviesByDirector(queryParams.queryParams.director)
        let ArrMoviesId = []
        for(let q = 0 ; q <persons.length;q++){
            ArrMoviesId.push(persons[q].movieid)
        }
        if((queryParams.queryParams.ratingKp===undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{id:{[Op.in]:ArrMoviesId}}})
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
                [Op.and]:[{id:{[Op.in]:ArrMoviesId}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}}]
                }
                })
                for(let q = 0 ; q <Flilms.length;q++){
                    films.push(Flilms[q])
                }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp!=undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
            [Op.and]:[{id:{[Op.in]:ArrMoviesId}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}},{voteskp:{[Op.gte]:queryParams.queryParams.votesKp}}]
            }
            })
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }
    }
    else if ((queryParams.queryParams.director===undefined)&&(queryParams.queryParams.actor!=undefined)&& //// актер , рейтиг КП, голоса КП
    (queryParams.queryParams.countries===undefined)&&(queryParams.queryParams.genres===undefined)){
        const persons = await this.getMoviesByActor(queryParams.queryParams.actor)
        let ArrMoviesId = []
        for(let q = 0 ; q <persons.length;q++){
            ArrMoviesId.push(persons[q].movieid)
        }
        if((queryParams.queryParams.ratingKp===undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{id:{[Op.in]:ArrMoviesId}}})
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
                [Op.and]:[{id:{[Op.in]:ArrMoviesId}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}}]
                }
                })
                for(let q = 0 ; q <Flilms.length;q++){
                    films.push(Flilms[q])
                }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp!=undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
            [Op.and]:[{id:{[Op.in]:ArrMoviesId}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}},{voteskp:{[Op.gte]:queryParams.queryParams.votesKp}}]
            }
            })
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }
        

    }
    else if(((queryParams.queryParams.countries!=undefined)||(queryParams.queryParams.genres!=undefined))&& ///// жанры или фильмы и режисер и актер , рейтиг КП, голоса КП
    (queryParams.queryParams.director!=undefined)&&(queryParams.queryParams.actor!=undefined)){
        let str = queryParams.queryParams.director+'@'+queryParams.queryParams.actor
        const persons = await this.getAllMoviesByDirectorAndActor(str)
        let ArrFilmswithDirectorIdActor = []
        for(let q = 0 ; q <persons.length;q++ ){
            if(ArrFilmId.includes(persons[q].movieid)){
                ArrFilmswithDirectorIdActor.push(persons[q].movieid)
            }
        }
        if((queryParams.queryParams.ratingKp===undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{id:{[Op.in]:ArrFilmswithDirectorIdActor}}})
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
                [Op.and]:[{id:{[Op.in]:ArrFilmswithDirectorIdActor}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}}]
                }
                })
                for(let q = 0 ; q <Flilms.length;q++){
                    films.push(Flilms[q])
                }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp!=undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
            [Op.and]:[{id:{[Op.in]:ArrFilmswithDirectorIdActor}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}},{voteskp:{[Op.gte]:queryParams.queryParams.votesKp}}]
            }
            })
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }
        
        
    }
    else if ((queryParams.queryParams.director!=undefined)&&(queryParams.queryParams.actor!=undefined)&& //// актер и режисер, рейтиг КП, голоса КП
    (queryParams.queryParams.countries===undefined)&&(queryParams.queryParams.genres===undefined)){
        let str = queryParams.queryParams.director+'@'+queryParams.queryParams.actor
        const persons = await this.getAllMoviesByDirectorAndActor(str)
        let ArrMoviesId = []
        for(let q = 0 ; q <persons.length;q++){
            ArrMoviesId.push(persons[q].movieid)
        }
        if((queryParams.queryParams.ratingKp===undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{id:{[Op.in]:ArrMoviesId}}})
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp===undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
                [Op.and]:[{id:{[Op.in]:ArrMoviesId}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}}]
                }
                })
                for(let q = 0 ; q <Flilms.length;q++){
                    films.push(Flilms[q])
                }
        }
        else if((queryParams.queryParams.ratingKp!=undefined)&&(queryParams.queryParams.votesKp!=undefined)){
            const Flilms = await this.filmRepository.findAll({where:{
            [Op.and]:[{id:{[Op.in]:ArrMoviesId}},{ratingkp:{[Op.gte]:queryParams.queryParams.ratingKp}},{voteskp:{[Op.gte]:queryParams.queryParams.votesKp}}]
            }
            })
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        }
        
    }
        const genresInfo = await this.getGenresByMoviesId(ArrFilmId)
        const namesofgenres = await this.getAllNamesOfGenres()
        const countriesInfo = await this.getCountriesByMoviesId(ArrFilmId)
        const namesofmovies = await this.getNamesOfMoviesByMoviesId(ArrFilmId)
        const persons = await this.getPersonsOfMoviesByMoviesId(ArrFilmId)
        const videos = await this.getVideosOfMoviesByMoviesId(ArrFilmId)
        
        for(let q = 0 ; q < films.length;q++){
            let ArrGenresId = []
            for(let w = 0 ; w < genresInfo.length;w++){
                if(genresInfo[w].movieid===films[q].id){
                    ArrGenresId.push(genresInfo[w].genreid)
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
            for(let w = 0 ;w<countriesInfo.length;w++){
                if(countriesInfo[w].movieid===films[q].id){
                    ArrCountries.push({name:countriesInfo[w].country})
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
     
            ArrFilms.push(
                {
                    film:films[q],
                    genres:ArrNamesOfGenres,
                    countries:ArrCountries,
                    namesoffilm:ArrNamesofFilms,
                    persons:ArrPersonsOfMovies,
                    videos:ArrVideos, 
                }
                )
            
        }
    
    


        return ArrFilms


        
        

     
            
        
        

    }
                
           
/////// Если вам понравился этот фильм /////////////////////////////////////////////////
        async eSLIWamPonravilsaEtotFilm(id:number){
        const film = await this.getFilmById(id)
            
        }


           
        
        
    

///// Сортировка    ////////////////////////////////////////////////////////////////////////////////////////////////

    async SortByVotesKp(films){
       
        let Arrfilm = []
        for(let i = 0 ;i<films.length;i++ ){
            Arrfilm.push(films[i])
        }
        return Arrfilm.sort((a, b) => b.film.voteskp - a.film.voteskp)
    }

    async SortByRatingKp(films){
        let Arrfilm = []
        for(let i = 0 ;i<films.length;i++ ){
            Arrfilm.push(films[i])
        }
        return Arrfilm.sort((a, b) => b.film.ratingkp - a.film.ratingkp)
    }

    async SortByDate(films){
        let Arrfilm = []
        for(let i = 0 ;i<films.length;i++ ){
            Arrfilm.push(films[i])
        }
        return Arrfilm.sort((a, b) => b.film.year - a.film.year)
    }

    async SortByName(films){
        let Arrfilm = []
        for(let i = 0 ;i<films.length;i++ ){
            Arrfilm.push(films[i])
        }
        return Arrfilm.sort((a, b) => {
            const nameA = a.film.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.film.name.toUpperCase(); // ignore upper and lowercase
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