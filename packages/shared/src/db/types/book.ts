import { type IMapDB, type IBaseDB, type Timestamp } from './common';
import { type MIME_TYPE, type APPROVE_STATUS, type BOOK_TYPE } from '../enum';

export interface IBookTypeDB extends IMapDB {
    id: BOOK_TYPE;
    name: string;
}

export interface IBookDB extends IBaseDB {
    status: APPROVE_STATUS;
    name: string;
    type?: BOOK_TYPE;
    typeV2: BOOK_TYPE[];
    mime: MIME_TYPE;
    imageUri: string;
    size: number;
    uri: string;
}

export interface IBookParsedItemDB {
    type: 'text' | 'image';
    value: string;
}

export type IBookParsedPageDB = {
    page: number;
    items: IBookParsedItemDB[];
};

export type IBookParsedDB = {
    pages: IBookParsedPageDB[];
    metadata: any;
    viewport?: any;
    bookId: string;
    images: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp; // Added updatedAt field
};
