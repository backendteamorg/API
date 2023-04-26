import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface VideosCreationAttr {
    id: number;
    movieid: number;
    name:string;
    nameEn:string;
}

@Table({tableName: "videos", createdAt: false, updatedAt: false})
export class Videos extends Model<Videos, VideosCreationAttr> {
    @Column({type: DataType.INTEGER,autoIncrement: true, primaryKey: true})
    id: number;
    @Column({type: DataType.INTEGER})
    movieid: number;
    @Column({type: DataType.TEXT})
    url:string;
    @Column({type: DataType.STRING})
    name:string;
    @Column({type: DataType.TEXT})
    site:string;
    @Column({type: DataType.STRING})
    type:string;
}