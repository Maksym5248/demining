import { type APPROVE_STATUS } from 'shared-my';

import { type IStatusDTO } from '~/api';

export interface IStatusData {
    id: APPROVE_STATUS;
    name: string;
}

export const createStatus = (value: IStatusDTO): IStatusData => ({
    id: value.id,
    name: value.name,
});
