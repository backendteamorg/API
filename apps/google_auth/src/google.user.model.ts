import { Table, Model, Column, DataType} from "sequelize-typescript";


interface GoogleUserCreationAttr {
    email: string;
    profileName: string;
}

@Table({tableName: "google_users"})
export class GoogleUser extends Model<GoogleUser, GoogleUserCreationAttr> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    profileName: string;
}