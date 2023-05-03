import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Length } from "class-validator";
export class ProfileDto{
    @IsNumber({},{message:'Должно быть числом'})
    readonly userId: number;
    @IsString({message: 'Должно быть строкой'})
    readonly fisrt_name: string;
    @IsString({message: 'Должно быть строкой'})
    readonly second_name: string;
    @Length(11,11,{message:'Некорретный номер телефона'})
    @IsString({message: 'Должно быть строкой'})
    readonly phonenumber: string;
}