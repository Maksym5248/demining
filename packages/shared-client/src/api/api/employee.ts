import { type IRankDB, type IEmployeeDB } from 'shared-my';

import { type ISubscriptionDocument, type ICreateValue, type IDBRemote, type IQuery, type IUpdateValue } from '~/common';

import { type IEmployeeDTO } from '../dto';

export interface IEmployeeAPI {
    create: (value: ICreateValue<IEmployeeDTO>) => Promise<IEmployeeDTO>;
    update: (id: string, value: IUpdateValue<IEmployeeDTO>) => Promise<IEmployeeDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IEmployeeDTO[]>;
    get: (id: string) => Promise<IEmployeeDTO>;
    subscribeRank: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IRankDB>[]) => void) => Promise<void>;
}

export class EmployeeAPI implements IEmployeeAPI {
    constructor(
        private db: {
            employee: IDBRemote<IEmployeeDB>;
            rank: IDBRemote<IRankDB>;
        },
    ) {}

    create = (value: ICreateValue<IEmployeeDTO>): Promise<IEmployeeDTO> => this.db.employee.create(value);
    update = (id: string, value: IUpdateValue<IEmployeeDTO>): Promise<IEmployeeDTO> => this.db.employee.update(id, value);
    remove = (id: string) => this.db.employee.remove(id);
    getList = (query?: IQuery): Promise<IEmployeeDTO[]> =>
        this.db.employee.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

    subscribeRank = (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IRankDB>[]) => void) => {
        return this.db.rank.subscribe(args, callback);
    };

    get = async (id: string): Promise<IEmployeeDTO> => {
        const res = await this.db.employee.get(id);
        if (!res) throw new Error('there is employee with id');
        return res;
    };
}
