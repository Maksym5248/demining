import { type BOOK_TYPE, type EXPLOSIVE_OBJECT_STATUS, type MIME_TYPE } from 'shared-my';

export interface IBookForm {
    name: string;
    mime: MIME_TYPE;
    status: EXPLOSIVE_OBJECT_STATUS;
    imageUri: string;
    uri: string;
    size: number;
    type: BOOK_TYPE;
}
