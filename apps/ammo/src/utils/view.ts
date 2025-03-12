import { isNumber } from 'lodash';
import { measurement } from 'shared-my';
import { type IFillerData, type ISizeData } from 'shared-my-client';

export const viewSize = (size?: ISizeData | null) => {
    if (!size) return '-';
    if (size.length && size.width && size.height)
        return `${measurement.mToMm(size.length)}x${measurement.mToMm(size.width)}x${measurement.mToMm(size.height)}`;
    if (size.length && size.height) return `${measurement.mToMm(size.length)}x${measurement.mToMm(size.height)}`;
    if (size.length && size.width) return `${measurement.mToMm(size.length)}x${measurement.mToMm(size.width)}`;
    if (size.length) return `${measurement.mToMm(size.length)}`;
    if (size.width) return `${measurement.mToMm(size.width)}`;
    if (size.height) return `${measurement.mToMm(size.height)}`;

    return undefined;
};

export function getFillterText(item: IFillerData) {
    if (item.description && item.weight) return `${item.description} (${item.weight})`;
    if (item.description && !item.weight) return item.description;
    if (!item.description && !!item.weight) return item.weight;
    return undefined;
}

const getMax = (value: number | null) => (isNumber(value) && value > 0 ? `+${value}` : value);

export const getTemurature = (value?: { min: number | null; max: number | null } | null) => {
    const { min, max } = value ?? {};

    if (min && max) return [min, getMax(max)];
    if (min) return [min];
    if (max) return [getMax(max)];

    return undefined;
};
