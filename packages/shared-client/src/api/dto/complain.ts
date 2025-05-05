import { type IComplainDB } from 'shared-my';

export interface IComplainDTO extends Omit<IComplainDB, 'author'> {}
export interface IComplainCreateParamsDTO extends IComplainDTO {}
