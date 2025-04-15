import { type Timestamp as TimestampInternal } from '@firebase/firestore-types';

import { type EXPLOSIVE_OBJECT_COMPONENT, type MATERIAL, type DOCUMENT_TYPE } from '../enum';

export type Timestamp = TimestampInternal;

export interface IBaseDB {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    organizationId?: string | null;
    authorId?: string;
    _search?: string[];
}
export interface ILinkedToDocumentDB {
    documentType: DOCUMENT_TYPE;
    documentId: string;
    executedAt: Timestamp | null;
}

export interface IFieldDB {
    name: string;
    value: string;
}

export interface ISectionInfoDB {
    description: string;
    imageUris: string[];
}

export interface IFillerDB {
    name: string | null;
    explosiveId: string | null;
    weight: number;
    variant: number;
    description?: string | null;
}

export interface ISizeDB {
    /**
     * length or radius
     */
    length: number | null; // m;
    width: number | null; // m;
    height: number | null; // m;
    variant: number | null;
    name?: string | null;
}

export interface IWeightDB {
    weight: number; // kg;
    variant: number | null;
}

export interface IExplosiveObjectComponentNotDB {
    id: EXPLOSIVE_OBJECT_COMPONENT;
    name: string;
}

export interface IMaterialNotDB {
    id: MATERIAL;
    name: string;
}

export interface ICountryDB {
    id: string;
    name: string;
}

export interface IMaterialDB {
    id: string;
    name: string;
}

export interface IRangeDB {
    min: number | null;
    max: number | null;
}

export interface IAddressDB {
    city: string | null;
    country: string | null;
    district: string | null;
    housenumber: string | null;
    postcode: string | null;
    state: string | null;
    street: string | null;
    municipality: string | null;
}
