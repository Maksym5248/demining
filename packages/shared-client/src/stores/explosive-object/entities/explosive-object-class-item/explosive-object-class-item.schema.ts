import { type IExplosiveObjectClassItemDTO } from '~/api';
import { data, type ICreateValue } from '~/common';

export interface IExplosiveObjectClassItemData {
    id: string;
    classId: string;
    name: string;
}

export const createExplosiveObjectClassItem = (value: IExplosiveObjectClassItemDTO): IExplosiveObjectClassItemData => ({
    id: value.id,
    name: value.name,
    classId: value.classId,
});

export const createExplosiveObjectClassItemDTO = (
    value: ICreateValue<IExplosiveObjectClassItemData>,
): ICreateValue<IExplosiveObjectClassItemDTO> => ({
    name: value.name,
    classId: value.classId,
});

export const updateExplosiveObjectClassItemDTO = data.createUpdateDTO<IExplosiveObjectClassItemData, IExplosiveObjectClassItemDTO>(
    (value) => ({
        name: value.name ?? '',
        classId: value.classId ?? '',
    }),
);
