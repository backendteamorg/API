import { IsNumber, IsString } from "class-validator";

export class FilteDto{
    readonly genre:string[];
    readonly countries:string[];
    readonly ratingKp: number; 
    readonly votesKp: number;
    readonly director: string;
    readonly actor: string;
   
    

}