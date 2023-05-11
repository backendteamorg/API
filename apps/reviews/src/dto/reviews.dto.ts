import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ReviewsOfMoviesDto {
    readonly movieid: number;
    @ApiProperty()
    @IsString({message: 'Должно быть строкой'})
    readonly title:string;
    @ApiProperty()
    @IsString({message: 'Должно быть строкой'})
    readonly review:string;
    @ApiProperty()
    @IsString({message: 'Должно быть строкой'})
    readonly author:string;
}