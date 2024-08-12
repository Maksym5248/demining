import { EXPLOSIVE_OBJECT_STATUS } from '../enum';

// Note: This is a shared file, but should be used only for ui and not in db

export const explosiveObjectStatuses = [
    {
        value: EXPLOSIVE_OBJECT_STATUS.CONFIRMED,
        label: 'Підтверджено',
    },
    {
        value: EXPLOSIVE_OBJECT_STATUS.REJECTED,
        label: 'Відхилено',
    },
    {
        value: EXPLOSIVE_OBJECT_STATUS.PENDING,
        label: 'Очікує підтвердження',
    },
];
