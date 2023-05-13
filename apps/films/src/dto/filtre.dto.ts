import { IsNumber, IsString } from "class-validator";

export class FilmDto{
    @IsString({message: 'Должно быть строкой'})
    readonly genre:string;
    @IsString({message: 'Должно быть строкой'})
    readonly name:string;
}