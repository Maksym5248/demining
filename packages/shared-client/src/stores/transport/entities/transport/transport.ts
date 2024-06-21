import { type ITransportAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type IRequestModel, RequestModel } from '~/models';

import { type ITransportValue, updateTransportDTO, createTransport, TransportValue } from './transport.schema';
import { IMessage } from '~/services';

export interface ITransport extends ITransportValue {
    updateFields(data: Partial<ITransportValue>): void;
    update: IRequestModel<[IUpdateValue<ITransportValue>]>;
    fullName: string;
}

interface IApi {
    transport: ITransportAPI;
}

interface IServices {
    message: IMessage;
}


export class Transport extends TransportValue implements ITransport {
    api: IApi;
    services: IServices;

    constructor(value: ITransportValue, { api, services }: { api: IApi, services: IServices }) {
        super(value);
        this.api = api;
        this.services = services;
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
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
