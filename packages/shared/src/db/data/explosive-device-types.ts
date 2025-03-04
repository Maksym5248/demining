import { EXPLOSIVE_DEVICE_TYPE } from '../enum';
import { type IExplosiveDeviceTypeNotDB } from '../types';

export const explosiveDeviceTypeData: IExplosiveDeviceTypeNotDB[] = [
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
];

export const explosiveDeviceTypeDataMap = explosiveDeviceTypeData.reduce(
    (acc, item) => {
        acc[item.id] = item;
        return acc;
    },
    {} as Record<EXPLOSIVE_DEVICE_TYPE, IExplosiveDeviceTypeNotDB>,
);
