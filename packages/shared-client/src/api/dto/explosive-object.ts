import {
    type IExplosiveObjectDB,
    type ISizeDB,
    type ICountryDB,
    type IExplosiveObjectClassDB,
    type IExplosiveObjectClassItemDB,
    type IExplosiveObjectTypeDB,
    type IExplosiveObjectDetailsDB,
    type IFillerDB,
    type IExplosiveDB,
    type IWeightDB,
    type ISectionInfoDB,
} from 'shared-my';

export type IWeightDTO = IWeightDB;
export type ISizeDTO = ISizeDB;
export type IFillerDTO = IFillerDB;
export type IExplosiveObjectDetailsDTO = Omit<IExplosiveObjectDetailsDB, 'status'>;
export type ISectionInfoDTO = ISectionInfoDB;

export type ICountryDTO = ICountryDB;
export type IExplosiveObjectClassDTO = IExplosiveObjectClassDB;
export type IExplosiveObjectClassItemDTO = IExplosiveObjectClassItemDB;
export type IExplosiveObjectTypeDTO = IExplosiveObjectTypeDB;

export type IExplosiveObjectDTO = IExplosiveObjectDB;
export interface IExplosiveObjectFullDTO extends IExplosiveObjectDTO {
    details: IExplosiveObjectDetailsDB | null;
    explosive: IExplosiveDB[];
    fuse: IExplosiveObjectDTO[];
    fervor: IExplosiveObjectDTO[];
}
