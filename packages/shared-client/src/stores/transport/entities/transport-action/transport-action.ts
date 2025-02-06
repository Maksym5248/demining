import { makeAutoObservable } from 'mobx';

import { type ITransportAPI } from '~/api';
import { type IMessage } from '~/services';

import { type ITransportActionData } from './transport-action.schema';
import { type ITransport, Transport } from '../transport/transport';

export interface ITransportAction {
    data: ITransportActionData;
    id: string;
    updateFields(data: Partial<ITransportActionData>): void;
    transport: ITransport;
}

interface IApi {
    transport: ITransportAPI;
}
interface IServices {
    message: IMessage;
}
interface ITransportActionParams {
    api: IApi;
    services: IServices;
}
export class TransportAction implements ITransportAction {
    api: IApi;
    services: IServices;
    data: ITransportActionData;

    constructor(data: ITransportActionData, params: ITransportActionParams) {
        this.data = data;
        this.api = params.api;
        this.services = params.services;

        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    updateFields(data: Partial<ITransportActionData>) {
        Object.assign(this.data, data);
    }

    get transport() {
        return new Transport(this.data, this);
    }
}
