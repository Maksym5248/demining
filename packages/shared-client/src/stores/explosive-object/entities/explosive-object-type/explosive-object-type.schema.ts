export interface IExplosiveObjectTypeData {
    id: string;
    name: string;
    fullName: string;
}

export const createExplosiveObjectType = (value: IExplosiveObjectTypeData): IExplosiveObjectTypeData => ({
    id: value.id,
    name: value.name,
    fullName: value.fullName,
});
