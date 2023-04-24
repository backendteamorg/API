import { Table, Model, Column, DataType, BelongsToMany} from "sequelize-typescript";


interface ProductionCompaniesCreationAttr {
    id: number;
    movieid: number;
    name:string;
    url:string;
    previewUrl:string;
   
}

@Table({tableName: "productioncompanies", createdAt: false, updatedAt: false})
export class ProductionCompanies extends Model<ProductionCompanies,ProductionCompaniesCreationAttr> {
    @Column({type: DataType.INTEGER,autoIncrement: true, primaryKey: true})
    id: number;
   
    @Column({type: DataType.INTEGER})
    movieid: number;
    @Column({type: DataType.STRING})
    name:string;
    @Column({type: DataType.STRING})
    url:string;
    @Column({type: DataType.STRING})
    previewUrl:string;
    
}