import { type Dayjs } from 'dayjs';
import { type IExplosiveObjectTypeDB } from 'shared-my/db';

import { dates } from '~/common';

export interface IExplosiveObjectTypeData {
    id: string;
    name: string;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export const createExplosiveObjectType = (value: IExplosiveObjectTypeDB): IExplosiveObjectTypeData => ({
    id: value.id,
    name: value.name,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
