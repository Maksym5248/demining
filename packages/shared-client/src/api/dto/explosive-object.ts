import {
    type IExplosiveObjectDB,
    type IStructureDB,
    type INeutralizationDB,
    type IActionDB,
    type ISizeDB,
    type IPurposeDB,
    type ILiquidatorDB,
    type ICountryDB,
    type IExplosiveObjectClassDB,
    type IExplosiveObjectClassItemDB,
    type IExplosiveObjectTypeDB,
    type IExplosiveObjectDetailsDB,
    type IFillerDB,
    type ITempartureDB,
    type IExplosiveDB,
    type IWeightDB,
    type IExtractionDB,
    type IFoldingDB,
    type IInstallationDB,
    type IEdditionalCharacteristcDB,
} from 'shared-my';

export type IWeightDTO = IWeightDB;
export type IStructureDTO = IStructureDB;
export type INeutralizationDTO = INeutralizationDB;
export type IActionDTO = IActionDB;
export type ITempartureDTO = ITempartureDB;
export type ISizeDTO = ISizeDB;
export type IPurposeDTO = IPurposeDB;
export type ILiquidatorDTO = ILiquidatorDB;
export type IExtractionDTO = IExtractionDB;
export type IFoldingDTO = IFoldingDB;
export type IFillerDTO = IFillerDB;
export type IInstallationDTO = IInstallationDB;
export type IExplosiveObjectDetailsDTO = IExplosiveObjectDetailsDB;

export type ICountryDTO = ICountryDB;
export type IExplosiveObjectClassDTO = IExplosiveObjectClassDB;
export type IExplosiveObjectClassItemDTO = IExplosiveObjectClassItemDB;
export type IExplosiveObjectTypeDTO = IExplosiveObjectTypeDB;
export type IEdditionalCharacteristcDTO = IEdditionalCharacteristcDB;

export type IExplosiveObjectDTO = IExplosiveObjectDB;
export interface IExplosiveObjectFullDTO extends IExplosiveObjectDTO {
    explosive: IExplosiveDB[];
}
