import { type IUpdateValue, type ICreateValue, type IQuery, type IDBRemote } from '~/common';

import { type ITransportDTO } from '../dto';

export interface ITransportAPI {
    create: (value: ICreateValue<ITransportDTO>) => Promise<ITransportDTO>;
    update: (id: string, value: IUpdateValue<ITransportDTO>) => Promise<ITransportDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<ITransportDTO[]>;
    get: (id: string) => Promise<ITransportDTO>;
}

export class TransportAPI implements ITransportAPI {
    constructor(
        private db: {
            transport: IDBRemote<ITransportDTO>;
        },
    ) {}

    create = (value: ICreateValue<ITransportDTO>): Promise<ITransportDTO> => this.db.transport.create(value);
    update = (id: string, value: IUpdateValue<ITransportDTO>): Promise<ITransportDTO> => this.db.transport.update(id, value);
    remove = (id: string) => this.db.transport.remove(id);
    getList = (query?: IQuery): Promise<ITransportDTO[]> =>
        this.db.transport.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });
    get = async (id: string): Promise<ITransportDTO> => {
        const res = await this.db.transport.get(id);
        if (!res) throw new Error('there is transport with id');
        return res;
    };
}
