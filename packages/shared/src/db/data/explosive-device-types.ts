import { EXPLOSIVE_DEVICE_TYPE } from '../enum';
import { type IExplosiveDeviceTypeDB } from '../types';

export const explosiveDeviceTypeData: Pick<IExplosiveDeviceTypeDB, 'id' | 'name'>[] = [
    {
        name: 'Заряд ВР',
        id: EXPLOSIVE_DEVICE_TYPE.EXPLOSIVE,
    },
    {
        name: 'Детонатор',
        id: EXPLOSIVE_DEVICE_TYPE.DETONATOR,
    },
    {
        name: 'Запальник',
        id: EXPLOSIVE_DEVICE_TYPE.IGNER,
    },
    {
        name: 'Детонуючий шнур',
        id: EXPLOSIVE_DEVICE_TYPE.DETONATION_CORD,
    },
    {
        name: 'Вогнепровідний шнур',
        id: EXPLOSIVE_DEVICE_TYPE.FIRETRANSFER_CORD,
    },
];

export const explosiveDeviceTypeDataMap = explosiveDeviceTypeData.reduce(
    (acc, item) => {
        acc[item.id] = item;
        return acc;
    },
    {} as Record<EXPLOSIVE_DEVICE_TYPE, Pick<IExplosiveDeviceTypeDB, 'id' | 'name'>>,
);
