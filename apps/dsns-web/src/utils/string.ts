import { DOCUMENT_TYPE } from '@/shared/db';

const getValue = (value: DOCUMENT_TYPE) =>
    ({
        [DOCUMENT_TYPE.MISSION_REPORT]: 'Виїзд',
        [DOCUMENT_TYPE.ORDER]: 'Наказ',
    })[value];

export const str = {
    getValue,
};
