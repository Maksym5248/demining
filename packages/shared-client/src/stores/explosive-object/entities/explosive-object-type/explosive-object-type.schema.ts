import { type IExplosiveObjectTypeDTO } from '~/api';

export interface IExplosiveObjectTypeData {
    id: string;
    name: string;
}

export const createExplosiveObjectType = (value: IExplosiveObjectTypeDTO): IExplosiveObjectTypeData => ({
    id: value.id,
    name: value.name,
});
