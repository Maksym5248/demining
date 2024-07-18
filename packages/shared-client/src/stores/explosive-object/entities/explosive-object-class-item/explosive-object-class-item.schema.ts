import { type IExplosiveObjectClassItemDTO } from '~/api';

export interface IExplosiveObjectClassItemData {
    id: string;
    classId: string;
    parentId: string | null;
    name: string;
}

export const createExplosiveObjectClassItem = (value: IExplosiveObjectClassItemDTO): IExplosiveObjectClassItemData => ({
    id: value.id,
    name: value.name,
    classId: value.classId,
    parentId: value.parentId,
});
