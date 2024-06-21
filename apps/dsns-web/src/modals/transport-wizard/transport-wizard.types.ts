import { type TRANSPORT_TYPE } from 'shared-my/db';

export interface ITransportForm {
    name: string;
    number: string;
    type: TRANSPORT_TYPE;
}
