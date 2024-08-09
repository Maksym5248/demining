import { type IExplosiveObjectTypeDTO } from '~/api';

export interface IExplosiveObjectGroupData {
    id: string;
    name: string;
    fullName: string;
}

export const createExplosiveObjectGroup = (value: IExplosiveObjectTypeDTO): IExplosiveObjectGroupData => ({
    id: value.id,
    name: value.name,
    fullName: value.fullName,
});
