import { APPROVE_STATUS } from '../enum';
import { type IStatusDB } from '../types';

export const explosiveObjectStatuses: Pick<IStatusDB, 'id' | 'name'>[] = [
    {
        id: APPROVE_STATUS.CONFIRMED,
        name: 'Підтверджено',
    },
    {
        id: APPROVE_STATUS.REJECTED,
        name: 'Відхилено',
    },
    {
        id: APPROVE_STATUS.PENDING,
        name: 'Очікує підтвердження',
    },
];
