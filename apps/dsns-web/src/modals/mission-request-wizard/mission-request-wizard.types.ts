import { type Dayjs } from 'dayjs';

import { type MISSION_REQUEST_TYPE } from '~/constants';

export interface IMissionRequestForm {
    type: MISSION_REQUEST_TYPE;
    number: string;
    signedAt: Dayjs;
}
