import { type EXPLOSIVE_OBJECT_CATEGORY, type APPROVE_STATUS, type EXPLOSIVE_OBJECT_COMPONENT, type METHRIC } from '~/db';

import { type ILinkedToDocumentDB, type Timestamp, type IBaseDB } from './common';

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

export interface IExplosiveObjectDB extends IBaseDB {
    name: string | null;
    fullName: string | null;
    description: string | null;
    status: APPROVE_STATUS;
    component: EXPLOSIVE_OBJECT_COMPONENT | null; // Боєприпас
    typeId: string | null; // Інженерний
    countryId: string; // СССР
    classItemIds: string[]; // протитанковий, протиднищевий; кумулятивний
    imageUri: string | null;
}

export interface IExplosiveObjectActionDB extends IExplosiveObjectDB, ILinkedToDocumentDB {
    explosiveObjectId: string;
    quantity: number;
    category: EXPLOSIVE_OBJECT_CATEGORY;
    isDiscovered: boolean;
    isTransported: boolean;
    isDestroyed: boolean;
    executedAt: Timestamp;
}
