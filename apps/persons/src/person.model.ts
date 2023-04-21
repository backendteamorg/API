import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface PersonsCreationAttr {
    id: number;
    movieid: number;
    
}

@Table({tableName: "persons", createdAt: false, updatedAt: false})
export class Persons extends Model<Persons, PersonsCreationAttr> {
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true})
    id: number;

    @Column({type: DataType.INTEGER})
    movieid: number;

}