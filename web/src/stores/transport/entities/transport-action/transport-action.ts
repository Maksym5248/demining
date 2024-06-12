import { ITransportActionValue, TransportActionValue } from './transport-action.schema';
import { ITransport, Transport } from '../transport/transport';

export interface ITransportAction extends ITransportActionValue {
    updateFields(data: Partial<ITransportActionValue>): void;
    transport: ITransport;
}
export class TransportAction extends TransportActionValue {
    constructor(data: ITransportActionValue) {
        super(data);
    }

    updateFields(data: Partial<ITransportActionValue>) {
        Object.assign(this, data);
    }

    get transport() {
        return new Transport(this);
    }
}
