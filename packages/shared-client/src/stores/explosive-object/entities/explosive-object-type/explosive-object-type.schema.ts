import { type METHRIC } from 'shared-my';

import { type IExplosiveObjectTypeDTO } from '~/api';

export interface IExplosiveObjectTypeData {
    id: string;
    name: string;
    fullName: string;
    hasCaliber?: boolean;
    metricCaliber?: METHRIC;
}

export const createExplosiveObjectType = (value: IExplosiveObjectTypeDTO): IExplosiveObjectTypeData => ({
    id: value.id,
    name: value.name,
    fullName: value.fullName,
    hasCaliber: !!value.hasCaliber,
    metricCaliber: value?.metricCaliber,
});
