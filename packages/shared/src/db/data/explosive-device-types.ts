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
];
