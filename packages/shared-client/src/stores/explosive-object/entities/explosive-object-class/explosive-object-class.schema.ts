import { type IExplosiveObjectClassDTO } from '~/api';
import { data, type ICreateValue } from '~/common';

export interface IExplosiveObjectClassData {
    id: string;
    name: string;
    authorId?: string;
}

export const createExplosiveObjectClass = (value: IExplosiveObjectClassDTO): IExplosiveObjectClassData => ({
    id: value.id,
    name: value.name,
    authorId: value.authorId,
});

export const createExplosiveObjectClassDTO = (value: ICreateValue<IExplosiveObjectClassData>): ICreateValue<IExplosiveObjectClassDTO> => ({
    name: value.name,
});

export const updateExplosiveObjectClassDTO = data.createUpdateDTO<IExplosiveObjectClassData, IExplosiveObjectClassDTO>(value => ({
    name: value.name ?? '',
}));
