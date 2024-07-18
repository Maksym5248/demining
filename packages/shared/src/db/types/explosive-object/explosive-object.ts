import { type EXPLOSIVE_OBJECT_TYPE_V1, type EXPLOSIVE_OBJECT_GROUP, type EXPLOSIVE_OBJECT_STATUS, type IAmmoDB, type IFuseDB } from '~/db';

import { type IBaseDB } from '../common';

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

export interface IExplosiveObjectClassDB {
    id: string;
    typeId: string;
    group: EXPLOSIVE_OBJECT_GROUP;
    name: string;
}

export interface IExplosiveObjectClassItemDB {
    id: string;
    classId: string;
    parentId: string | null;
    name: string;
}

export interface IExplosiveObjectTypeDB {
    id: string;
    name: string;
}
export interface ICountryDB {
    id: string;
    name: string;
}

export interface IExplosiveObjectDB extends IBaseDB {
    name: string | null;
    status: EXPLOSIVE_OBJECT_STATUS;
    group: EXPLOSIVE_OBJECT_GROUP; // Боєприпас
    countryId: string; // СССР
    typeId: string; // інженерний
    classIds: string[]; // протитанковий, протиднищевий; кумулятивний
    details: IAmmoDB | IFuseDB | null;
}
