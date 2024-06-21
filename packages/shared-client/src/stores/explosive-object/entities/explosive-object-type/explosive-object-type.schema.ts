export interface IExplosiveObjectTypeValue {
    id: string;
    name: string;
    fullName: string;
}

export const createExplosiveObjectType = (value: IExplosiveObjectTypeValue): IExplosiveObjectTypeValue => ({
    id: value.id,
    name: value.name,
    fullName: value.fullName,
});

export class ExplosiveObjectTypeValue implements IExplosiveObjectTypeValue {
    id: string;
    name: string;
    fullName: string;

    constructor(value: IExplosiveObjectTypeValue) {
        this.id = value.id;
        this.name = value.name;
        this.fullName = value.fullName;
    }
}
