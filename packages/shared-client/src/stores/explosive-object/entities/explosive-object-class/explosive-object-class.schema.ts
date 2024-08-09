import { type IExplosiveObjectClassDTO } from '~/api';

export interface IExplosiveObjectClassData {
    id: string;
    name: string;
}

export const createExplosiveObjectClass = (value: IExplosiveObjectClassDTO): IExplosiveObjectClassData => ({
    id: value.id,
    name: value.name,
});
