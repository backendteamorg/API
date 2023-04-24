import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface ReviewsOfMoviesCreationAttr {
    id: number;
    movieid: number;
    name:string;
    logo:string;
    url:string;
}

@Table({tableName: "reviews"})
export class ReviewsOfMovies extends Model<ReviewsOfMovies, ReviewsOfMoviesCreationAttr> {
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