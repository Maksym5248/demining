import { APPROVE_STATUS, type IStatusDB } from 'shared-my';

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
