import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ReviewsOfMoviesDto {
    movieid: number;
    @ApiProperty()
    @IsString({message: 'Должно быть строкой'})
    review:string;
    @ApiProperty()
    @IsString({message: 'Должно быть строкой'})
    author:string;
}