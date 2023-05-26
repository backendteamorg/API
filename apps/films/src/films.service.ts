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
                                name:namesofgenres[w].name,
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
            
        
  
            ArrFilms.push(
                {
                    film:films[q],
                    genres:ArrNamesOfGenres,
                    countries:ArrCountries
                }
                )
            
        }


        return ArrFilms
    }   






  async formDatabase() {
    const movieREQ =  await fetch(`https://api.kinopoisk.dev/v1/movie?type=movie&type=cartoon&selectFields=\
rating%20votes%20movieLength%20images%20id%20type%20\
name%20description%20\
premiere%20year%20poster%20alternativeName%20ageRating%20\
shortDescription%20technology%20imagesInfo&sortField=votes.kp&sortType=-1&page=1&limit=1000`, {
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
                {   id:json.docs[i].id,
                    type:json.docs[i].type,
                    name:json.docs[i].name,
                    enName:json.docs[i].alternativeName,
                    posterUrl:json.docs[i].poster?.url, 		
                    posterPreviewURL:json.docs[i].poster?.previewUrl,	
                    premiereRussia:json.docs[i].premiere?.russia, 		
                    hasIMAX:json.docs[i].technology?.hasImax,
                    year:json.docs[i].year,
                    description:json.docs[i].description,
                    shortDescription:json.docs[i].shortDescription,
                    ageRating:json.docs[i].ageRating,
                    ratingKp:json.docs[i].rating?.kp,	
                    votesKp:json.docs[i].votes?.kp,		
                    movieLength:json.docs[i].movieLength

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
        const persons = await this.getPersonsByMovieId(idF)
        const videos = await this.getVideosByMovieId(idF)   
        


        let ArrNamesOfGenres = []
        for(let w = 0 ; w < namesofgenres.length;w++){
            for(let e = 0 ; e < genres.length;e++){
                if(namesofgenres[w].id===genres[e].genreid){
                    ArrNamesOfGenres.push(
                        {
                            name:namesofgenres[w].name,
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

       
        
        let ArrPersonsOfMovies = []
            for(let w = 0 ;w<persons.length;w++){
                ArrPersonsOfMovies.push(
                        {
                            id:persons[w].personid,
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
            persons:ArrPersonsOfMovies,
            trailer :ArrVideos
            
            
            
        }
    }











    async getAllFilms(){
        return this.filmRepository.findAll()
    }




    async updateNameMovie(dto:FilmDto){
        const film =  await this.filmRepository.findOne({where: {id: dto.id}})
        film.name = dto.name;
        film.enName = dto.enName;
        film.save();
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

    async getAllCountriesNames(){
        const ob$ = await this.rabbitCountriesFilmsService.send({
            cmd: 'get-all-names-of-countries',
          },
          {});
          const countries = await firstValueFrom(ob$).catch((err) => console.error(err));
          return countries;
    }
    async getFilmsUseFiltre(queryParams:any){
        const {sortField, sortOrder, limit, type, page ,genres, countries, ratingKp, votesKp, director,actor} = queryParams; 
       
        if(queryParams.queryParams.sortField===undefined){
            queryParams.queryParams.sortField = 'ratingKp'
        }
        if(queryParams.queryParams.sortOrder===undefined){
            queryParams.queryParams.sortOrder = 'DESC'
        }
        if(queryParams.queryParams.limit===undefined){
            queryParams.queryParams.limit = 10
        }
        if(queryParams.queryParams.page===undefined){
            queryParams.queryParams.page = 1
        }
     
     

       
        let ArrFilmId =[]
        
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

   
    let films = []
    let ArrFilmswithDirectorIdOrActor = []

    const filtre = {...({id:{[Op.in]:ArrFilmId}}),...(queryParams.queryParams.type && {type:{[Op.eq]:queryParams.queryParams.type}}),...(queryParams.queryParams.ratingKp && {ratingKp: {[Op.gte]: queryParams.queryParams.ratingKp}}),
    ...(queryParams.queryParams.votesKp&&{votesKp:{[Op.gte]:queryParams.queryParams.votesKp}}),}
    const FiltreType = {...(queryParams.queryParams.type && {type:{[Op.eq]:queryParams.queryParams.type}}),...(queryParams.queryParams.ratingKp && {ratingKp: {[Op.gte]: queryParams.queryParams.ratingKp}}),
    ...(queryParams.queryParams.votesKp&&{votesKp:{[Op.gte]:queryParams.queryParams.votesKp}})}
    const filtreWithActorOrDirecor = {...({id:{[Op.in]:ArrFilmswithDirectorIdOrActor}}),...(queryParams.queryParams.type && {type:{[Op.eq]:queryParams.queryParams.type}}),...(queryParams.queryParams.ratingKp && {ratingKp: {[Op.gte]: queryParams.queryParams.ratingKp}}),
    ...(queryParams.queryParams.votesKp&&{votesKp:{[Op.gte]:queryParams.queryParams.votesKp}}),}
    const FiltreRatingKPvotesKP = {...(queryParams.queryParams.ratingKp && {ratingKp: {[Op.gte]: queryParams.queryParams.ratingKp}}),
    ...(queryParams.queryParams.votesKp&&{votesKp:{[Op.gte]:queryParams.queryParams.votesKp}})}
    if(((queryParams.queryParams.countries!=undefined)||(queryParams.queryParams.genres!=undefined))&& ///// жанры или cтраны 
    (queryParams.queryParams.director===undefined)&&(queryParams.queryParams.actor===undefined)){
            const Flilms = await this.filmRepository.findAll({where:filtre
            })
            for(let q = 0 ; q <Flilms.length;q++){
            films.push(Flilms[q])
            }
            
            
          
        

    }

    else if(((queryParams.queryParams.countries!=undefined)||(queryParams.queryParams.genres!=undefined))&& ///// жанры или фильмы и режисер
    (queryParams.queryParams.director!=undefined)&&(queryParams.queryParams.actor===undefined)){
        const persons = await this.getAllMoviesByDirector(queryParams.queryParams.director)
            
            for(let q = 0 ; q <persons.length;q++ ){
                if(ArrFilmId.includes(persons[q].movieid)){
                    ArrFilmswithDirectorIdOrActor.push(persons[q].movieid)
                }
            }
    
           
                const Flilms = await this.filmRepository.findAll({where:filtreWithActorOrDirecor,
                order:[[queryParams.queryParams.sortField ,queryParams.queryParams.sortOrder]]
                })
                for(let q = 0 ; q <Flilms.length;q++){
                    films.push(Flilms[q])
                }
            
        
        
        
    }
    else if(((queryParams.queryParams.countries!=undefined)||(queryParams.queryParams.genres!=undefined))&& ///// жанры или  и актер 
    (queryParams.queryParams.director===undefined)&&(queryParams.queryParams.actor!=undefined)){
        const persons = await this.getMoviesByActor(queryParams.queryParams.actor)
        for(let q = 0 ; q <persons.length;q++ ){
            if(ArrFilmId.includes(persons[q].movieid)){
                ArrFilmswithDirectorIdOrActor.push(persons[q].movieid)
            }
        }
       
                const Flilms = await this.filmRepository.findAll({where:filtreWithActorOrDirecor,
                order:[[queryParams.queryParams.sortField ,queryParams.queryParams.sortOrder]]
                })
                for(let q = 0 ; q <Flilms.length;q++){
                    films.push(Flilms[q])
                }
            
        
        
    }
    else if ((queryParams.queryParams.director!=undefined)&&(queryParams.queryParams.actor===undefined)&&  ///// режисер , рейтиг КП, голоса КП
    (queryParams.queryParams.countries===undefined)&&(queryParams.queryParams.genres===undefined)){
        const persons = await this.getAllMoviesByDirector(queryParams.queryParams.director)
        for(let q = 0 ; q <persons.length;q++){
            ArrFilmId.push(persons[q].movieid)
        }
        
           
                const Flilms = await this.filmRepository.findAll({where:filtre,
                order:[[queryParams.queryParams.sortField ,queryParams.queryParams.sortOrder]]
                })
                for(let q = 0 ; q <Flilms.length;q++){
                    films.push(Flilms[q])
                }
            
            
        
    }
    else if ((queryParams.queryParams.director===undefined)&&(queryParams.queryParams.actor!=undefined)&& //// актер , рейтиг КП, голоса КП
    (queryParams.queryParams.countries===undefined)&&(queryParams.queryParams.genres===undefined)){
        const persons = await this.getMoviesByActor(queryParams.queryParams.actor)
        for(let q = 0 ; q <persons.length;q++){
            ArrFilmId.push(persons[q].movieid)
        }
        
                const Flilms = await this.filmRepository.findAll({where:filtre,
                order:[[queryParams.queryParams.sortField ,queryParams.queryParams.sortOrder]]
                })
                for(let q = 0 ; q <Flilms.length;q++){
                    films.push(Flilms[q])
                }
           
          
        
        

    }
    else if(((queryParams.queryParams.countries!=undefined)||(queryParams.queryParams.genres!=undefined))&& ///// жанры или фильмы и режисер и актер , рейтиг КП, голоса КП
    (queryParams.queryParams.director!=undefined)&&(queryParams.queryParams.actor!=undefined)){
        let str = queryParams.queryParams.director+'@'+queryParams.queryParams.actor
        const persons = await this.getAllMoviesByDirectorAndActor(str)
      
        for(let q = 0 ; q <persons.length;q++ ){
            if(ArrFilmId.includes(persons[q].movieid)){
                ArrFilmswithDirectorIdOrActor.push(persons[q].movieid)
            }
        }
        
            const Flilms = await this.filmRepository.findAll({where:filtreWithActorOrDirecor,
                order:[[queryParams.queryParams.sortField ,queryParams.queryParams.sortOrder]]
            })
            for(let q = 0 ; q <Flilms.length;q++){
                films.push(Flilms[q])
            }
        

        
        
    }
    else if ((queryParams.queryParams.director!=undefined)&&(queryParams.queryParams.actor!=undefined)&& //// актер и режисер, рейтиг КП, голоса КП
    (queryParams.queryParams.countries===undefined)&&(queryParams.queryParams.genres===undefined)){
        let str = queryParams.queryParams.director+'@'+queryParams.queryParams.actor
        const persons = await this.getAllMoviesByDirectorAndActor(str)
        for(let q = 0 ; q <persons.length;q++){
            ArrFilmId.push(persons[q].movieid)
        }
       
        
                const Flilms = await this.filmRepository.findAll({where:filtre,
                 order:[[queryParams.queryParams.sortField ,queryParams.queryParams.sortOrder]]
                })
                for(let q = 0 ; q <Flilms.length;q++){
                    films.push(Flilms[q])
                }
            
            
        
    }
    else if ((queryParams.queryParams.director===undefined)&&(queryParams.queryParams.actor===undefined)&& //// тип, рейтинг КП, голоса КП
    (queryParams.queryParams.countries===undefined)&&(queryParams.queryParams.genres===undefined)&&(queryParams.queryParams.type!=undefined)&&((queryParams.queryParams.ratingKp!=undefined)||queryParams.queryParams.votesKp!=undefined)){
       const Films= await this.filmRepository.findAll({where:FiltreType,
            order:[[queryParams.queryParams.sortField ,queryParams.queryParams.sortOrder]]})
        for(let q = 0 ; q <Films.length;q++){
            films.push(Films[q])
        }
    }
    else if ((queryParams.queryParams.director===undefined)&&(queryParams.queryParams.actor===undefined)&& //// рейтинг КП, голоса КП
    (queryParams.queryParams.countries===undefined)&&(queryParams.queryParams.genres===undefined)&&(queryParams.queryParams.type===undefined)&&((queryParams.queryParams.ratingKp!=undefined)||queryParams.queryParams.votesKp!=undefined)){
       const Films= await this.filmRepository.findAll({where:FiltreRatingKPvotesKP,
            order:[[queryParams.queryParams.sortField ,queryParams.queryParams.sortOrder]]})
        for(let q = 0 ; q <Films.length;q++){
            films.push(Films[q])
        }
    }
        const genresInfo = await this.getGenresByMoviesId(ArrFilmId)
        const namesofgenres = await this.getAllNamesOfGenres()
        const countriesInfo = await this.getCountriesByMoviesId(ArrFilmId)
       
        let AllFilms = await this.filmRepository.findAll()
        if(queryParams.queryParams.limit>AllFilms.length){
            queryParams.queryParams.limit = AllFilms.length
        }


        if(((queryParams.queryParams.countries!=undefined)||(queryParams.queryParams.genres!=undefined))||(queryParams.queryParams.type!=undefined)
        ||(queryParams.queryParams.ratingKp!=undefined)||(queryParams.queryParams.votesKp!=undefined)
        ||(queryParams.queryParams.director!=undefined)||(queryParams.queryParams.actor!=undefined)||(queryParams.queryParams.sortField!=undefined)
        ||(queryParams.queryParams.sortOrder!=undefined)){
            let FilmsLenth = queryParams.queryParams.limit*queryParams.queryParams.page
            let ArrFilm = []
            let ArrFilmPage = []
            let Page = 1
            let count = 0
            if(films.length<FilmsLenth){
                FilmsLenth =films.length
            }
            for(let q = 0 ; q<FilmsLenth;q++){
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
                                    name:namesofgenres[w].name,
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
                ArrFilmPage.push(
                    {
                        film:films[q],
                        genres:ArrNamesOfGenres,
                        countries:ArrCountries,
    
                    }
                )
                count+=1
                if((count==queryParams.queryParams.limit||count===FilmsLenth)){
                    ArrFilm.push({
                        page:ArrFilmPage,
                        pageLenth:ArrFilmPage.length,
                        Npage:Page,
                    })
                    Page+=1
                    count=0
                    ArrFilmPage=[]
                }
                
            }
                
            return {
                docs:ArrFilm,
                limit:queryParams.queryParams.limit,
                page:queryParams.queryParams.page,
                lenth:ArrFilm.length
            }
            
        }
        

    }
     

            
       
        

    
        
    
        


    
                
           
/////// Если вам понравился этот фильм /////////////////////////////////////////////////
        async eSLIWamPonravilsaEtotFilm(id:number){
        const film = await this.getFilmById(id)
            
        }


           
        
        
    



    
}