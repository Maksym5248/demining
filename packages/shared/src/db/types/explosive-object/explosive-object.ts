import { type EXPLOSIVE_OBJECT_STATUS, type EXPLOSIVE_OBJECT_COMPONENT, type METHRIC, type MATERIAL } from '~/db';

import { type IBaseDB } from '../common';

export interface IExplosiveObjectComponentNotDB {
    id: EXPLOSIVE_OBJECT_COMPONENT;
    name: string;
}

export interface IMaterialNotDB {
    id: MATERIAL;
    name: string;
}

export interface IExplosiveObjectClassDB extends IBaseDB {
    id: string;
    name: string;
}

export interface IExplosiveObjectClassItemDB extends IBaseDB {
    id: string;
    name: string;
    shortName: string;
    description?: string;
    classId: string;
    typeId: string;
    component: EXPLOSIVE_OBJECT_COMPONENT;
    parentId: string | null; // class item
}

export interface IExplosiveObjectTypeDB extends IBaseDB {
    id: string;
    name: string;
    imageUri: string | null;
    fullName: string;
    hasCaliber?: boolean;
    metricCaliber?: METHRIC;
}

export interface ICountryDB {
    id: string;
    name: string;
}

export interface IMaterialDB {
    id: string;
    name: string;
}

export interface IExplosiveObjectDB extends IBaseDB {
    name: string | null;
    fullName: string | null;
    description: string | null;
    status: EXPLOSIVE_OBJECT_STATUS;
    component: EXPLOSIVE_OBJECT_COMPONENT | null; // Боєприпас
    typeId: string | null; // Інженерний
    countryId: string; // СССР
    classItemIds: string[]; // протитанковий, протиднищевий; кумулятивний
    imageUri: string | null;
}
