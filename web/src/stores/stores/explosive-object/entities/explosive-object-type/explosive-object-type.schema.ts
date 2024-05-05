

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
