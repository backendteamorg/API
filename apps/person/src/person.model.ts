import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface PersonCreationAttr {
    id: number;
    name: string;
    enName:string;
    photo:string;
    sex:string;
    growth:string;
    birthday:string;
    death:string;
    age:string;
    birthPlace:string;
    deathPlace:string;
    countAwards:number;
}

@Table({tableName: "person", createdAt: false, updatedAt: false})
export class Person extends Model<Person, PersonCreationAttr> {
    @Column({type: DataType.INTEGER,autoIncrement: true, primaryKey: true})
    id: number;
    @Column({type: DataType.STRING})
    name: string;
    @Column({type: DataType.STRING})
    enName:string;
    @Column({type: DataType.STRING})
    photo:string;
    @Column({type: DataType.STRING})
    sex:string;
    @Column({type: DataType.STRING})
    growth:string;
    @Column({type: DataType.STRING})
    birthday:string;
    @Column({type: DataType.STRING})
    death:string;
    @Column({type: DataType.STRING})
    age:string;
    @Column({type: DataType.STRING})
    birthPlace:string;
    @Column({type: DataType.STRING})
    deathPlace:string;
    @Column({type: DataType.INTEGER})
    countAwards:number;
}