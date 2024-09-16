import { type Dayjs } from 'dayjs';
import {
    type IExplosiveObjectActionDataParams,
    type IMapViewActionDataParams,
    type IExplosiveActionDataParams,
    type IAddressData,
} from 'shared-my-client';

import { type WIZARD_MODE } from '~/constants';

export interface IMissionReportProps {
    id?: string;
    isVisible: boolean;
    hide: () => void;
    mode: WIZARD_MODE;
}

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
    mapView: IMapViewActionDataParams;
    workStart: Dayjs;
    exclusionStart?: Dayjs;
    transportingStart?: Dayjs;
    destroyedStart?: Dayjs;
    workEnd: Dayjs;
    transportExplosiveObjectId?: string;
    transportHumansId?: string;
    mineDetectorId?: string;
    explosiveObjectActions: IExplosiveObjectActionDataParams[];
    squadLeaderId: string;
    squadIds: string[];
    address: string;
    addressDetails: IAddressData;
    explosiveActions: IExplosiveActionDataParams[];
}
