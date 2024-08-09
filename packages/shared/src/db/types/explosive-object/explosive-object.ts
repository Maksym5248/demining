import {
    type EXPLOSIVE_OBJECT_TYPE,
    type EXPLOSIVE_OBJECT_GROUP,
    type EXPLOSIVE_OBJECT_STATUS,
    type EXPLOSIVE_OBJECT_COMPONENT,
} from '~/db';

import { type IExplosiveObjectDetailsDB } from './common';
import { type IBaseDB } from '../common';

export interface IExplosiveObjectDBv1 extends IBaseDB {
    typeId: EXPLOSIVE_OBJECT_TYPE;
    name: string | null;
    caliber: number | null;
}

export interface IExplosiveObjectDBv2 extends IBaseDB {
    typeId: EXPLOSIVE_OBJECT_TYPE;
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
    groupId: string;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    name: string;
}

export interface IExplosiveObjectClassItemDB {
    id: string;
    classId: string;
    parentId: string | null;
    name: string;
}

export interface IExplosiveObjectGroupDB {
    id: string;
    name: string;
    fullName: string;
}

export interface IExplosiveObjectTypeDB {
    id: string;
    name: string;
    fullName: string;
}

export interface ICountryDB {
    id: string;
    name: string;
}

export interface IExplosiveObjectDB extends IBaseDB {
    name: string | null;
    status: EXPLOSIVE_OBJECT_STATUS;
    component: EXPLOSIVE_OBJECT_COMPONENT; // Боєприпас
    groupId: string; // Інженерний
    countryId: string; // СССР
    classIds: string[]; // протитанковий, протиднищевий; кумулятивний
    /** @deprecated */
    typeId: string; // old
    details: IExplosiveObjectDetailsDB | null;
}
