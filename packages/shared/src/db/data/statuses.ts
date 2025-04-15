import { APPROVE_STATUS } from '../enum';

// Note: This is a shared file, but should be used only for ui and not in db

export const explosiveObjectStatuses = [
    {
        value: APPROVE_STATUS.CONFIRMED,
        label: 'Підтверджено',
    },
    {
        value: APPROVE_STATUS.REJECTED,
        label: 'Відхилено',
    },
    {
        value: APPROVE_STATUS.PENDING,
        label: 'Очікує підтвердження',
    },
];
