import { type Dayjs } from 'dayjs';

import { type IBookAssetsDTO } from '~/api';
import { dates } from '~/common';

export interface IBookAssetsData extends Omit<IBookAssetsDTO, 'createdAt' | 'updatedAt'> {
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createBookAssets = (value: IBookAssetsDTO): IBookAssetsData => ({
    ...value,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
