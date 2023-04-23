import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface WatchabilityOfMoviesOfMoviesCreationAttr {
    id: number;
    movieid: number;
    name:string;
    logo:string;
    url:string;
}

@Table({tableName: "watchability", createdAt: false, updatedAt: false})
export class WatchabilityOfMovies extends Model<WatchabilityOfMovies, WatchabilityOfMoviesOfMoviesCreationAttr> {
    @Column({type: DataType.INTEGER,autoIncrement: true, primaryKey: true})
    id: number;
    @Column({type: DataType.INTEGER})
    movieid: number;
    @Column({type: DataType.STRING,allowNull:false})
    name:string;
    @Column({type: DataType.STRING,allowNull:true})
    logo:string;
    @Column({type: DataType.STRING,allowNull:true})
    url:string;
}