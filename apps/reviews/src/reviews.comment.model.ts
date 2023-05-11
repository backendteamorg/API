import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface ReviewsCommentsOfMoviesCreationAttr {
    id: number;
    reviewid: number;
    title:string;
    comment:string;
    author:string;
    
}

@Table({tableName: "reviewscomments"})
export class ReviewsCommentsOfMovies extends Model<ReviewsCommentsOfMovies, ReviewsCommentsOfMoviesCreationAttr> {
    @Column({type: DataType.INTEGER,autoIncrement: true, primaryKey: true})
    id: number;
    @Column({type: DataType.INTEGER})
    reviewid: number;
    @Column({type: DataType.TEXT})
    title:string;
    @Column({type: DataType.TEXT})
    comment:string;
    @Column({type: DataType.STRING})
    author:string;
}