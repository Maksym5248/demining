import { type IBaseDB } from './common';
import { type ASSET_TYPE, type DOCUMENT_TYPE, type MIME_TYPE } from '../enum';

export interface IDocumentDB extends IBaseDB {
    name: string;
    type: ASSET_TYPE;
    documentType: DOCUMENT_TYPE;
    mime: MIME_TYPE;
    authorId: string;
}
