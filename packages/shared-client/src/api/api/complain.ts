import { type IComplainDB } from 'shared-my';

import { type ICreateValue, type IDBBase } from '~/common';

import { type IComplainDTO, type IComplainCreateParamsDTO } from '../dto';

export interface IComplainAPI {
    create: (value: ICreateValue<IComplainCreateParamsDTO>) => Promise<IComplainDTO>;
}

export class ComplainAPI implements IComplainAPI {
    constructor(
        private db: {
            complain: IDBBase<IComplainDB>;
        },
    ) {}

    create = async (value: ICreateValue<IComplainCreateParamsDTO>): Promise<IComplainDTO> => {
        const res = await this.db.complain.create(value);
        return res;
    };
}
