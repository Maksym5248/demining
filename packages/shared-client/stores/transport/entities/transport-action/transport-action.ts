import { type ITransportAPI } from '~/api';

import { type ITransportActionValue, TransportActionValue } from './transport-action.schema';
import { type ITransport, Transport } from '../transport/transport';

export interface ITransportAction extends ITransportActionValue {
    updateFields(data: Partial<ITransportActionValue>): void;
    transport: ITransport;
}

interface IApi {
    transport: ITransportAPI;
}
export class TransportAction extends TransportActionValue {
    api: IApi;

    constructor(data: ITransportActionValue, params: { api: IApi }) {
        super(data);

        this.api = params.api;
    }

    updateFields(data: Partial<ITransportActionValue>) {
        Object.assign(this, data);
    }

    get transport() {
        return new Transport(this, this);
    }
}
