import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface SpokenLanguageCreationAttr {
    id: number;
    movieid: number;
    name:string;
    nameEn:string;
}

@Table({tableName: "spokenlanguage", createdAt: false, updatedAt: false})
export class SpokenLanguage extends Model<SpokenLanguage, SpokenLanguageCreationAttr> {
    @Column({type: DataType.INTEGER,autoIncrement: true, primaryKey: true})
    id: number;
    @Column({type: DataType.INTEGER})
    movieid: number;
    @Column({type: DataType.STRING})
    name:string;
    @Column({type: DataType.STRING})
    nameEn:string;
}