import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface NamesOfMoviesCreationAttr {
    id: number;
    movieid: number;
    name:string;
    language:string;
    type:string;
}

@Table({tableName: "namesOfMuvies", createdAt: false, updatedAt: false})
export class NamesOfMovies extends Model<NamesOfMovies, NamesOfMoviesCreationAttr> {
    @Column({type: DataType.INTEGER,autoIncrement: true, primaryKey: true})
    id: number;
    @Column({type: DataType.INTEGER})
    movieid: number;
    @Column({type: DataType.STRING,allowNull:false})
    name:string;
    @Column({type: DataType.STRING,allowNull:true})
    language:string;
    @Column({type: DataType.STRING,allowNull:true})
    type:string;
}