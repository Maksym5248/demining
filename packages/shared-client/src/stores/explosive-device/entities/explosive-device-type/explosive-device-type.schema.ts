import { type EXPLOSIVE_DEVICE_TYPE } from 'shared-my';

import { type IExplosiveDeviceTypeDTO } from '~/api';

export interface IExplosiveDeviceTypeData {
    id: EXPLOSIVE_DEVICE_TYPE;
    name: string;
}

export const createExplosiveDeviceType = (value: IExplosiveDeviceTypeDTO): IExplosiveDeviceTypeData => ({
    id: value.id,
    name: value.name,
});
