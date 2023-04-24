import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface SposesOfPersonCreationAttr {
    id: number;
    personid: number;
    sposesid:number;
    name: string;
    divorced:string;
    divorcedReason:string;
    sex:string;
    children:number
    relation:string;
}

@Table({tableName: "sposesofperson", createdAt: false, updatedAt: false})
export class SposesOfPerson extends Model<SposesOfPerson, SposesOfPersonCreationAttr> {
    @Column({type: DataType.INTEGER,autoIncrement: true, primaryKey: true})
    id: number;
    @Column({type: DataType.INTEGER})
    personid: number;
    @Column({type: DataType.INTEGER})
    sposesid:number;
    @Column({type: DataType.STRING})
    name: string;
    @Column({type: DataType.STRING})
    divorced:string;
    @Column({type: DataType.STRING})
    divorcedReason:string;
    @Column({type: DataType.STRING})
    sex:string;
    @Column({type: DataType.INTEGER})
    children:number
    @Column({type: DataType.STRING})
    relation:string;
}