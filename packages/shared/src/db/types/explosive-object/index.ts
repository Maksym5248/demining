import { type IAmmoDB } from './ammo';
import { type IFuse } from './fuse';
import { type EXPLOSIVE_OBJECT_TYPES } from '../../enum';
import { type IBaseDB } from '../common';

export interface IExplosiveObjectDBv1 extends IBaseDB {
    typeId: string;
    name: string | null;
    caliber: number | null;
    authorId: string;
}

export interface IExplosiveObjectDB extends IBaseDB {
    name: string | null;
    type: EXPLOSIVE_OBJECT_TYPES[];
    isConfirmed: boolean; // means that data is correct
    data: IAmmoDB | IFuse | null;
}
