import { type COMPLAIN_TYPE } from 'shared-my';

export interface IComplainParams {
    type: COMPLAIN_TYPE;
    entityId: string;
}

export interface IComplainScreenProps {
    route?: {
        params?: IComplainParams;
    };
}
