import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Length } from "class-validator";
export class ProfileDto{
    @IsNumber({},{message:'Должно быть числом'})
    @ApiProperty({example:13,description:'ИН пользователя'})
    readonly userId: number;
    @IsString({message: 'Должно быть строкой'})
    @ApiProperty({example:'Иван',description:'Имя'})
    readonly fisrt_name: string;
    @IsString({message: 'Должно быть строкой'})
    @ApiProperty({example:'Иванов',description:'Фамилия'})
    readonly second_name: string;
    @Length(11,11,{message:'Некорретный номер телефона'})
    @IsString({message: 'Должно быть строкой'})
    @ApiProperty({example:'84443332211',description:'Номер телефона'})
    readonly phonenumber: string;
}