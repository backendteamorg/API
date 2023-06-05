import { Table, Model, Column, HasOne, DataType, BelongsToMany} from "sequelize-typescript";
import { Role } from "../role/role.model";
import { GoogleUserRoles } from "../role/googleUser-roles.model";

interface UserCreationAttr {
    userId: string;
    email: string;
    displayName: string;
    refreshToken: string;
}

@Table({tableName: 'google_users'})
export class GoogleUser extends Model<GoogleUser, UserCreationAttr> {

    @Column({type: DataType.TEXT, unique: true, allowNull: false, primaryKey: true})
    userId: string

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    displayName: string;

    @Column({type: DataType.STRING, allowNull: false})
    refreshToken: string;

    @BelongsToMany(() => Role, () => GoogleUserRoles)
    roles: Role[]
}