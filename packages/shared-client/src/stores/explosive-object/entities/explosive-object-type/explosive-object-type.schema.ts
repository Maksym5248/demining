import { type IExplosiveObjectTypeDTO } from '~/api';

export interface IExplosiveObjectTypeData {
    id: string;
    name: string;
    fullName: string;
    hasCaliber?: boolean;
}

export const createExplosiveObjectType = (value: IExplosiveObjectTypeDTO): IExplosiveObjectTypeData => ({
    id: value.id,
    name: value.name,
    fullName: value.fullName,
    hasCaliber: !!value.hasCaliber,
});
