import { type Dayjs } from 'dayjs';
import { type MISSION_REQUEST_TYPE } from 'shared-my/db';

export interface IMissionRequestForm {
    type: MISSION_REQUEST_TYPE;
    number: string;
    signedAt: Dayjs;
}
