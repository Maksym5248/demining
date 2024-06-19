import { message } from 'antd';

import { type ITransportAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type IRequestModel, RequestModel } from '~/models';

import { type ITransportValue, updateTransportDTO, createTransport, TransportValue } from './transport.schema';

export interface ITransport extends ITransportValue {
    updateFields(data: Partial<ITransportValue>): void;
    update: IRequestModel<[IUpdateValue<ITransportValue>]>;
    fullName: string;
}

interface IApi {
    transport: ITransportAPI;
}

export class Transport extends TransportValue implements ITransport {
    api: IApi;

    constructor(value: ITransportValue, { api }: { api: IApi }) {
        super(value);
        this.api = api;
    }

    updateFields(data: Partial<ITransportValue>) {
        Object.assign(this, data);
    }
    get fullName() {
        return `${this.name} н/з ${this.number}`;
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<ITransportValue>) => {
            const res = await this.api.transport.update(this.id, updateTransportDTO(data));

            this.updateFields(createTransport(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
