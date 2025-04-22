import { type IFieldDB, type IBaseDB, type IRangeDB } from './common';
import { type APPROVE_STATUS } from '../enum';

export interface IExplosiveCompositionDB {
    explosiveId: string | null;
    name: string | null;
    percent: number | null;
    description: string | null;
}

export interface IExplosiveDB extends IBaseDB {
    status?: APPROVE_STATUS;
    name: string;
    imageUri: string | null;
    imageUris: string[] | null;
    fullName: string | null;
    formula: string | null;
    description: string | null;
    additional: IFieldDB[] | null; // додатково
    composition: IExplosiveCompositionDB[] | null;
    /** @deprecated */
    explosive?: {
        velocity: number | null; // m/s
        brisantness: number | null; // m
        explosiveness: number | null; // m³
        tnt: number | null; // TNT equivalent
    } | null;
    sensitivity?: {
        shock: string | null;
        temperature: string | null;
        friction: string | null;
    } | null;
    /** @deprecated */
    physical?: {
        density: number | null; // kg/m³
        meltingPoint: number | null; // °C
        ignitionPoint: number | null; // °C
    } | null;
    explosiveV2: {
        velocity: IRangeDB | null; // m/s
        brisantness: IRangeDB | null; // m
        explosiveness: IRangeDB | null; // m³
        tnt: IRangeDB | null; // TNT equivalent
    } | null;
    physicalV2: {
        density: IRangeDB | null; // kg/m³
        meltingPoint: IRangeDB | null; // °C
        ignitionPoint: IRangeDB | null; // °C
    } | null;
    authorId: string;
}
