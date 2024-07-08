import { type IAmmoDB } from './ammo';
import { type IFuse } from './fuse';
import { type EXPLOSIVE_OBJECT_TYPE } from '../../enum';
import { type IBaseDB } from '../common';

export interface IExplosiveObjectDB extends IBaseDB {
    name: string | null;
    type: EXPLOSIVE_OBJECT_TYPE; // TODO: change types;
    isConfirmed: boolean;
    data: IAmmoDB | IFuse | null;
    // caliber: number | null // TODO: remove;
}
