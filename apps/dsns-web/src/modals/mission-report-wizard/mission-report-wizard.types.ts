import {
    type IExplosiveObjectActionValueParams,
    type IMapViewActionValueParams,
    type IExplosiveActionValueParams,
    type IAddressValue,
} from '@/shared-client/stores';
import { type Dayjs } from 'dayjs';

export interface IMissionReportForm {
    approvedAt: Dayjs;
    approvedById: string;
    number: number;
    subNumber?: number;
    executedAt: Dayjs;
    orderId: string;
    missionRequestId: string;
    checkedTerritory?: number;
    depthExamination?: number;
    uncheckedTerritory?: number;
    uncheckedReason?: string;
    mapView: IMapViewActionValueParams;
    workStart: Dayjs;
    exclusionStart?: Dayjs;
    transportingStart?: Dayjs;
    destroyedStart?: Dayjs;
    workEnd: Dayjs;
    transportExplosiveObjectId?: string;
    transportHumansId?: string;
    mineDetectorId?: string;
    explosiveObjectActions: IExplosiveObjectActionValueParams[];
    squadLeaderId: string;
    squadIds: string[];
    address: string;
    addressDetails: IAddressValue;
    explosiveActions: IExplosiveActionValueParams[];
}
