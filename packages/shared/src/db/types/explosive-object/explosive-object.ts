import {
    type EXPLOSIVE_OBJECT_TYPE,
    type EXPLOSIVE_OBJECT_STATUS,
    type EXPLOSIVE_OBJECT_COMPONENT,
    type EXPLOSIVE_OBJECT_CLASS,
} from '~/db';

import { type IExplosiveObjectDetailsDB } from './common';
import { type IBaseDB } from '../common';

export interface IExplosiveObjectComponentNotDB {
    id: EXPLOSIVE_OBJECT_COMPONENT;
    name: string;
}

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
            group: EXPLOSIVE_OBJECT_TYPE;
            typeIds: string[];
            caliber: number | null;
        };
    };
}

export interface IExplosiveObjectClassDB {
    id: string;
    class: EXPLOSIVE_OBJECT_CLASS;
    typeId: string;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    name: string;
}

export interface IExplosiveObjectClassItemDB {
    id: string;
    classId: string;
    parentId: string | null;
    name: string;
    description?: string;
}

export interface IExplosiveObjectTypeDB {
    id: string;
    name: string;
    fullName: string;
    hasCaliber?: boolean;
}

export interface ICountryDB {
    id: string;
    name: string;
}

export interface IExplosiveObjectDB extends IBaseDB {
    name: string | null;
    status: EXPLOSIVE_OBJECT_STATUS;
    component: EXPLOSIVE_OBJECT_COMPONENT | null; // Боєприпас
    typeId: string | null; // Інженерний
    countryId: string; // СССР
    classIds: string[]; // протитанковий, протиднищевий; кумулятивний
    imageUri: string | null;
    details: IExplosiveObjectDetailsDB | null;
}
