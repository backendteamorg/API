import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ReviewsOfMoviesDto {
    movieid: number;
    @ApiProperty({example: 'user@mail.ru',description: 'Почта'})
    @IsString({message: 'Должно быть строкой'})
    review:string;
    @IsString({message: 'Должно быть строкой'})
    author:string;
}