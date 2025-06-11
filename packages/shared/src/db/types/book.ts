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

export interface IBookAssetsItemDB {
    type: 'text' | 'image';
    value: string;
}

export type IBookAssetsPageDB = {
    page: number;
    items: IBookAssetsItemDB[];
};

export type IBookAssetsDB = {
    id: string;
    pages: IBookAssetsPageDB[];
    metadata: any;
    viewport?: any;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
