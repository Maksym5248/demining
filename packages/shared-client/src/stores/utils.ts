import { isNumber } from 'lodash';

import { type IRangeDTO } from '~/api';

import { type IRangeData } from './type';

export const createRange = (value?: IRangeDTO | number | null): IRangeData =>
    ({
        min: (isNumber(value) ? value : value?.min) ?? null,
        max: (isNumber(value) ? null : value?.max) ?? null,
    }) as IRangeData;

export const createRangeDTO = (value?: IRangeData | null): IRangeDTO => ({
    min: value?.min ?? null,
    max: value?.max ?? null,
});
