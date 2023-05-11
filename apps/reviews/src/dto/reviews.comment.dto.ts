import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ReviewsCommentOfMoviesDto {
    @ApiProperty()
    readonly reviewid: number;
    @ApiProperty()
    @IsString({message: 'Должно быть строкой'})
    readonly title:string;
    @ApiProperty()
    @IsString({message: 'Должно быть строкой'})
    readonly comment:string;
    @ApiProperty()
    @IsString({message: 'Должно быть строкой'})
    readonly author:string;
}