import { type IMapDB, type IBaseDB, type Timestamp } from './common';
import { type MIME_TYPE, type APPROVE_STATUS, type BOOK_TYPE, type LOADING_STATUS } from '../enum';

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
    assetsStatus?: LOADING_STATUS;
}

export interface IBookAssetsItemDB {
    type: 'text' | 'image';
    value: string;
}

export type IBookAssetsPageDB = {
    page: number;
    items: IBookAssetsItemDB[];
};

export type IBookAssetParsed = {
    id: string;
    pages: IBookAssetsPageDB[];
    metadata: any;
    viewport?: any;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export type IBookAssetsDB = {
    id: string;
    page: number;
    texts: string[];
    images: string[];
    bookId: string;
    metadata: any;
    viewport?: any;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
