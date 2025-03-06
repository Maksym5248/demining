import { type Dayjs } from 'dayjs';
import { type BOOK_TYPE, EXPLOSIVE_OBJECT_STATUS, MIME_TYPE } from 'shared-my';

import { type IBookDTO } from '~/api';
import { data, dates, type ICreateValue } from '~/common';

export interface IBookData {
    id: string;
    name: string;
    mime: MIME_TYPE;
    status: EXPLOSIVE_OBJECT_STATUS;
    imageUri: string;
    size: number;
    uri: string;
    type: BOOK_TYPE[];
    authorId?: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createBookDTO = (value: ICreateValue<IBookData>): ICreateValue<IBookDTO> => ({
    name: value.name ?? null,
    typeV2: value.type ?? null,
    mime: value.mime ?? null,
    status: value.status ?? null,
    imageUri: value.imageUri ?? null,
    size: value.size ?? 0,
    uri: value.uri ?? null,
});

export const updateBookDTO = data.createUpdateDTO<IBookData, IBookDTO>(value => ({
    name: value?.name ?? '',
    typeV2: value.type ?? [],
    mime: value?.mime ?? MIME_TYPE.PNG,
    status: value?.status ?? EXPLOSIVE_OBJECT_STATUS.PENDING,
    imageUri: value?.imageUri ?? '',
    size: value?.size ?? 0,
    uri: value?.uri ?? '',
}));

export const createBook = (value: IBookDTO): IBookData => ({
    id: value.id,
    name: value.name,
    authorId: value.authorId,
    type: value.typeV2 ?? (value.type ? [value.type] : []),
    status: value.status,
    imageUri: value.imageUri,
    size: value.size ?? 0,
    uri: value.uri,
    mime: value.mime,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
