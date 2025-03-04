import { type Timestamp as TimestampInternal } from '@firebase/firestore-types';

import { type DOCUMENT_TYPE } from '../enum';

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
