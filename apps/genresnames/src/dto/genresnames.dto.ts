import { IsNumber, IsString } from "class-validator";

export class GenresNamesDto{
    @IsNumber({},{message:'Должно быть числом'})
    readonly id: number;
    @IsString({message: 'Должно быть строкой'})
    readonly genre:string;
}