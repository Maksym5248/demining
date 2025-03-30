import { makeAutoObservable } from 'mobx';

import { type ITransportAPI } from '~/api';
import { type IUpdateValue } from '~/common';
import { type IDataModel, type IRequestModel, RequestModel } from '~/models';
import { type IMessage } from '~/services';

import { type ITransportData, updateTransportDTO, createTransport } from './transport.schema';

export interface ITransport extends IDataModel<ITransportData> {
    updateFields(data: Partial<ITransportData>): void;
    update: IRequestModel<[IUpdateValue<ITransportData>]>;
    fullName: string;
}

interface IApi {
    transport: ITransportAPI;
}

interface IServices {
    message: IMessage;
}

export class Transport implements ITransport {
    api: IApi;
    services: IServices;
    data: ITransportData;

    constructor(data: ITransportData, { api, services }: { api: IApi; services: IServices }) {
        this.data = data;

        this.api = api;
        this.services = services;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    updateFields(data: Partial<ITransportData>) {
        Object.assign(this.data, data);
    }
    get fullName() {
        return `${this.data.name} н/з ${this.data.number}`;
    }

    update = new RequestModel({
        run: async (data: IUpdateValue<ITransportData>) => {
            const res = await this.api.transport.update(this.data.id, updateTransportDTO(data));

            this.updateFields(createTransport(res));
        },
        onSuccuss: () => this.services.message.success('Збережено успішно'),
        onError: () => this.services.message.error('Не вдалось додати'),
    });
}
