import { type MISSION_REQUEST_TYPE } from '@/shared/db';
import { type Dayjs } from 'dayjs';

export interface IMissionRequestForm {
    type: MISSION_REQUEST_TYPE;
    number: string;
    signedAt: Dayjs;
}
