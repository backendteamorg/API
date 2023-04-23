import { ApiProperty } from "@nestjs/swagger";
import { Table, Model, Column, DataType } from "sequelize-typescript";



interface FilmsCreationAttr {
    id: number;
    feesworld: string;
    feesusa:string;
    status:string;
    externalIdkpHD:string;
    externalIdimdb:string;
    externalIdtmdb:number;
    ratingkp:number;
    ratingimdb:number;
    ratingfilmCritics:number;
    ratingrussianFilmCritics:number;
    voteskp:number;
    votesimdb:number;
    votesfilmCritics:number;
    votesrussianFilmCritics:number;
    backdropurl:string;
    backdroppreviewUrl:string;
    movieLength:number;
    imagespostersCount:string;
    imagesbackdropsCount:string;
    imagesframesCount:string;
    type:string;
    name:string;
    description:string;
    distributor:string;
    distributorRelease:string;
    premiereworld:string;
    premiererussia:string;
    premierebluray:string;
    slogan:string;
    year:number;
    budget:string;
    posterurl:string;
    posterpreviewUrl:string;
    typeNumber:number;
    alternativeName:string;
    enName:string;
    ageRating:number;
    ratingMpaa:string;
    shortDescription:string;
    hasImax:boolean;
    has3D:boolean;
    ticketsOnSale:boolean;
    updatedAt:string
    top10:number;
    top250:number;
}

@Table({tableName: "films", createdAt: false, updatedAt: false})
export class Films extends Model<Films, FilmsCreationAttr> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true})
    id: number;
    @Column({type: DataType.STRING})
    status:string
    @Column({type: DataType.STRING})
    feesworld: string;
    @Column({type: DataType.STRING})
    feesusa:string;
    @Column({type: DataType.STRING,unique:true})
    externalIdkpHD:string;
    @Column({type: DataType.STRING,unique:true})
    externalIdimdb:string;
    @Column({type: DataType.INTEGER,unique:true})
    externalIdtmdb:number;
    @Column({type: DataType.FLOAT})
    ratingkp: number;
    @Column({type: DataType.FLOAT})
    ratingimdb:number;
    @Column({type: DataType.FLOAT})
    ratingfilmCritics:number;
    @Column({type: DataType.FLOAT})
    ratingrussianFilmCritics:number;
    @Column({type: DataType.INTEGER})
    voteskp:number;
    @Column({type: DataType.INTEGER})
    votesimdb:number;
    @Column({type: DataType.INTEGER})
    votesfilmCritics:number;
    @Column({type: DataType.INTEGER})
    votesrussianFilmCritics:number;
    @Column({type: DataType.STRING})
    backdropurl:string;
    @Column({type: DataType.STRING})
    backdroppreviewUrl:string;
    @Column({type: DataType.INTEGER})
    movieLength:number;
    @Column({type: DataType.STRING})
    imagespostersCount:string;
    @Column({type: DataType.STRING})
    imagesbackdropsCount:string;
    @Column({type: DataType.STRING})
    imagesframesCount:string;
    @Column({type: DataType.STRING})
    type:string;
    @Column({type: DataType.STRING})
    name:string;
    @Column({type: DataType.TEXT})
    description:string;
    @Column({type: DataType.STRING})
    distributor:string;
    @Column({type: DataType.STRING})
    distributorRelease:string;
    @Column({type: DataType.DATE})
    premiereworld:string;
    @Column({type: DataType.DATE})
    premiererussia:string;
    @Column({type: DataType.DATE})
    premierebluray:string;
    @Column({type: DataType.STRING})
    slogan:string;
    @Column({type: DataType.INTEGER})
    year:number;
    @Column({type: DataType.STRING})
    budget:string;
    @Column({type: DataType.STRING})
    posterurl:string;
    @Column({type: DataType.STRING})
    posterpreviewUrl:string;
    @Column({type: DataType.INTEGER})
    typeNumber:number;
    @Column({type: DataType.STRING})
    alternativeName:string;
    @Column({type: DataType.STRING})
    enName:string;
    @Column({type: DataType.INTEGER})
    ageRating:number;
    @Column({type: DataType.STRING})
    ratingMpaa:string;
    @Column({type: DataType.STRING})
    shortDescription:string;
    @Column({type: DataType.BOOLEAN})
    hasImax:boolean;
    @Column({type: DataType.BOOLEAN})
    technologyhas3D:boolean;
    @Column({type: DataType.BOOLEAN})
    ticketsOnSale:boolean;
    @Column({type: DataType.DATE})
    updatedAt:string
    @Column({type: DataType.INTEGER})
    top10:number;
    @Column({type: DataType.INTEGER})
    top250:number;
}