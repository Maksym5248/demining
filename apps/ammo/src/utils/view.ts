import { measurement } from 'shared-my';
import { type ISizeData } from 'shared-my-client';

export const viewSize = (size?: ISizeData | null) => {
    if (!size) return '-';
    if (size.length && size.height) return `${measurement.mToMm(size.length)}x${measurement.mToMm(size.height)}`;
    if (size.length && size.width && size.height)
        return `${measurement.mToMm(size.length)}x${measurement.mToMm(size.width)}x${measurement.mToMm(size.height)}`;
};
