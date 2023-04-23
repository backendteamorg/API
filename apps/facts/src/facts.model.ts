import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface FactsOfMoviesCreationAttr {
    id: number;
    movieid: number;
    name:string;
    logo:string;
    url:string;
}

@Table({tableName: "factsofmovie", createdAt: false, updatedAt: false})
export class FactsOfMovies extends Model<FactsOfMovies, FactsOfMoviesCreationAttr> {
    @Column({type: DataType.INTEGER,autoIncrement: true, primaryKey: true})
    id: number;
    @Column({type: DataType.INTEGER})
    movieid: number;
    @Column({type: DataType.TEXT})
    value:string;
    @Column({type: DataType.STRING})
    type:string;
    @Column({type: DataType.BOOLEAN})
    spoiler:boolean;
}