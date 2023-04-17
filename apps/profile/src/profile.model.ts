import { ApiProperty } from "@nestjs/swagger";
import { Auth } from "apps/auth/src/auth.model";
import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";



interface ProfileCreationAttrs {
    userId: number;
    fisrt_name: string;
    second_name: string;
    phonenumber: string;
}

@Table({tableName: 'profile'})
export class Profile extends Model<Profile, ProfileCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    @ApiProperty({example: '34', description: 'ИН пользователя'})
    @Column({type: DataType.INTEGER,unique: true,allowNull: false})
    userId: number;
    @ApiProperty({example: 'Иван', description: 'Имя'})
    @Column({type: DataType.STRING})
    fisrt_name: string;
    @ApiProperty({example: 'Иванов', description: 'Фамилия'})
    @Column({type: DataType.STRING})
    second_name: string;
    @ApiProperty({example: '85553339977', description: 'Номер телефона'})
    @Column({type: DataType.STRING})
    phonenumber: string;
}