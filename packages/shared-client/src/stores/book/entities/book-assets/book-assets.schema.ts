import { type Dayjs } from 'dayjs';

import { type IBookAssetsPageDTO, type IBookAssetsDTO } from '~/api';
import { dates } from '~/common';

export interface IBookAssetsData extends Omit<IBookAssetsDTO, 'createdAt' | 'updatedAt'> {
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export interface IBookAssetsPageData extends IBookAssetsPageDTO {}

export const createBookAssets = (value: IBookAssetsDTO): IBookAssetsData => ({
    ...value,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
