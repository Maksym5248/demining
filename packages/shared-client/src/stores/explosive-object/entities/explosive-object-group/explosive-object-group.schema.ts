import { type IExplosiveObjectGroupDTO } from '~/api';

export interface IExplosiveObjectGroupData {
    id: string;
    name: string;
    fullName: string;
    hasCaliber: boolean;
}

export const createExplosiveObjectGroup = (value: IExplosiveObjectGroupDTO): IExplosiveObjectGroupData => ({
    id: value.id,
    name: value.name,
    fullName: value.fullName,
    hasCaliber: value.hasCaliber,
});
