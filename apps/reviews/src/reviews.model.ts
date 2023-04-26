import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface ReviewsOfMoviesCreationAttr {
    id: number;
    movieid: number;
    title:string;
    review:string;
    author:string;
    
}

@Table({tableName: "reviews"})
export class ReviewsOfMovies extends Model<ReviewsOfMovies, ReviewsOfMoviesCreationAttr> {
    @Column({type: DataType.INTEGER,autoIncrement: true, primaryKey: true})
    id: number;
    @Column({type: DataType.INTEGER})
    movieid: number;
    @Column({type: DataType.TEXT})
    title:string;
    @Column({type: DataType.TEXT})
    review:string;
    @Column({type: DataType.STRING})
    author:string;
}