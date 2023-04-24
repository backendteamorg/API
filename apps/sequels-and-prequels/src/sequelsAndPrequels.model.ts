import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface SequelsandPrequeilsCreationAttr {
    id: number;
    movieid: number;
    sequelsAndPrequelsID:number;
    name:string;
    enName:string;
    alternativeName:string;
    type:string;
    posterurl:string;
    posterpreviewUrl:string;
}

@Table({tableName: "sequelsandprequels", createdAt: false, updatedAt: false})
export class SequelsandPrequeils extends Model<SequelsandPrequeils,SequelsandPrequeilsCreationAttr> {
    @Column({type: DataType.INTEGER,autoIncrement: true, primaryKey: true})
    id: number;
    @Column({type: DataType.INTEGER})
    movieid: number;
    @Column({type: DataType.INTEGER})
    sequelsAndPrequelsID:number;
    @Column({type: DataType.STRING})
    name:string;
    @Column({type: DataType.STRING})
    enName:string;
    @Column({type: DataType.STRING})
    alternativeName:string;
    @Column({type: DataType.STRING})
    type:string;
    @Column({type: DataType.STRING})
    posterurl:string;
    @Column({type: DataType.STRING})
    posterpreviewUrl:string;
    
}