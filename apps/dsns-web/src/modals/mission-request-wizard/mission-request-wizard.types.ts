import { Dayjs } from 'dayjs';

import { MISSION_REQUEST_TYPE } from '~/constants';

export interface IMissionRequestForm {
    type: MISSION_REQUEST_TYPE;
    number: string;
    signedAt: Dayjs;
}
