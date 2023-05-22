import { IsNumber, IsString } from "class-validator";

export class FilteDto{
    readonly genres:string[];
    readonly countries:string[];
    readonly ratingKp: number; 
    readonly votesKp: number;
    readonly director: string;
    readonly actor: string;
    readonly limit:number;
    readonly sort: string;

}