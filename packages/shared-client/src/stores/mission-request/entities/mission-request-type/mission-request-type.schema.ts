import { type MISSION_REQUEST_TYPE } from 'shared-my';

import { type IMissionRequestTypeDTO } from '~/api';

export interface IMissionRequestTypeData {
    id: MISSION_REQUEST_TYPE;
    name: string;
}

export const createMissionRequestType = (value: IMissionRequestTypeDTO): IMissionRequestTypeData => ({
    id: value.id,
    name: value.name,
});
