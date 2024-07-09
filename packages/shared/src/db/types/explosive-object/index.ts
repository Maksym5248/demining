import { type EXPLOSIVE_OBJECT_TYPE_V1, type EXPLOSIVE_OBJECT_TYPE } from '~/db/enum';
import { type IExplosiveObjectCategoryDB } from '~/db/enum/entities/explosive-object/type';

import { type IAmmoDB } from './ammo';
import { type IFuse } from './fuse';
import { type IBaseDB } from '../common';

export interface IExplosiveObjectDBv1 extends IBaseDB {
    typeId: EXPLOSIVE_OBJECT_TYPE_V1;
    name: string | null;
    caliber: number | null;
}

export interface IExplosiveObjectDB extends IBaseDB {
    name: string | null;
    type: EXPLOSIVE_OBJECT_TYPE;
    categoryIds: IExplosiveObjectCategoryDB[];
    isConfirmed: boolean; // means that data is correct
    data: IAmmoDB | IFuse | null;
}
