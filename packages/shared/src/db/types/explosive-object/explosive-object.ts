import {
    type EXPLOSIVE_OBJECT_TYPE_V1,
    type EXPLOSIVE_OBJECT_GROUP,
    type EXPLOSIVE_OBJECT_STATUS,
    type MANUFACTURED_COUNTRY,
    type IAmmoDB,
    type IFuseDB,
} from '~/db';

import { type IBaseDB } from '../common';

//
// 1 - create types
// 2 - create classification
// 3 - create class
// 4 - create object
// 5 - create object details
export interface IExplosiveObjectDBv1 extends IBaseDB {
    typeId: EXPLOSIVE_OBJECT_TYPE_V1;
    name: string | null;
    caliber: number | null;
}

export interface IExplosiveObjectDBv2 extends IBaseDB {
    typeId: EXPLOSIVE_OBJECT_TYPE_V1;
    name: string | null;
    caliber: number | null;
    meta: {
        copy: {
            group: EXPLOSIVE_OBJECT_GROUP;
            typeIds: string[];
            caliber: number | null;
        };
    };
}

export interface IExplosiveObjectClassificationDB extends IBaseDB {
    typeId: string;
    group: EXPLOSIVE_OBJECT_GROUP;
    name: string; // за призначенням, тип ураження, спосіб ураження
}

export interface IExplosiveObjectClassDB extends IBaseDB {
    classId: string;
    parentId: string | null;
    name: string; // протиднищевий, протипіхотний, протиповітряний
}

export interface IExplosiveObjectTypeDB extends IBaseDB {
    id: string;
    name: string;
}

export interface IExplosiveObjectDB extends IBaseDB {
    name: string | null;
    country: MANUFACTURED_COUNTRY; // СССР
    status: EXPLOSIVE_OBJECT_STATUS;
    group: EXPLOSIVE_OBJECT_GROUP; // Боєприпас
    typeId: string; // інженерний
    classIds: string[]; // протитанковий, протиднищевий; кумулятивний
    details: IAmmoDB | IFuseDB | null;
}
