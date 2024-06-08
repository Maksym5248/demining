import { TRANSPORT_TYPE } from '~/constants';

export interface ITransportForm {
    name: string;
    number: string;
    type: TRANSPORT_TYPE;
}
