import { type ITransportAPI } from '~/api';
import { customMakeAutoObservable } from '~/common';
import { type IMessage } from '~/services';

import { type ITransportActionValue, TransportActionValue } from './transport-action.schema';
import { type ITransport, Transport } from '../transport/transport';

export interface ITransportAction extends ITransportActionValue {
    updateFields(data: Partial<ITransportActionValue>): void;
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
export class TransportAction extends TransportActionValue {
    api: IApi;
    services: IServices;

    constructor(data: ITransportActionValue, params: ITransportActionParams) {
        super(data);

        this.api = params.api;
        this.services = params.services;

        customMakeAutoObservable(this);
    }

    updateFields(data: Partial<ITransportActionValue>) {
        Object.assign(this, data);
    }

    get transport() {
        return new Transport(this, this);
    }
}
