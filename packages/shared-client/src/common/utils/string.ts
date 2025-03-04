import { isNumber } from 'lodash';

import { type ISizeData } from '~/stores';

export const getSizeLabel = (item: ISizeData) => {
    let res = '';

    if (!item.length && !item.width && !item.height) return 'невідомо';

    if (item.length && item.width && item.height) {
        res = `${item.length}x${item.width}x${item.height}`;
    } else if (item.length && item.width) {
        res = `${item.length}x${item.width}`;
    } else if (item.length && item.height) {
        res = `${item.length}x${item.height}`;
    } else if (item.width && item.height) {
        res = `${item.width}x${item.height}`;
    } else if (item.length) {
        res = `${item.length}`;
    } else if (item.width) {
        res = `${item.width}`;
    } else if (item.height) {
        res = `${item.height}`;
    }

    return !isNumber(item?.variant) ? res : `${res} (${item?.variant})`;
};
