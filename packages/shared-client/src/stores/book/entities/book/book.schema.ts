import { type Dayjs } from 'dayjs';
import { type BOOK_TYPE, APPROVE_STATUS, MIME_TYPE, LOADING_STATUS } from 'shared-my';

import { type IBookDTO } from '~/api';
import { data, dates, type ICreateValue } from '~/common';

export interface IBookData {
    id: string;
    name: string;
    mime: MIME_TYPE;
    status: APPROVE_STATUS;
    imageUri: string;
    size: number;
    uri: string;
    type: BOOK_TYPE[];
    assetsStatus: LOADING_STATUS;
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
    assetsStatus: LOADING_STATUS.LOADING,
});

export const updateBookDTO = data.createUpdateDTO<IBookData, IBookDTO>(value => ({
    name: value?.name ?? '',
    typeV2: value.type ?? [],
    mime: value?.mime ?? MIME_TYPE.PNG,
    status: value?.status ?? APPROVE_STATUS.PENDING,
    imageUri: value?.imageUri ?? '',
    size: value?.size ?? 0,
    uri: value?.uri ?? '',
    assetsStatus: value.assetsStatus ?? LOADING_STATUS.LOADING,
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
    assetsStatus: value.assetsStatus ?? LOADING_STATUS.IDLE,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
