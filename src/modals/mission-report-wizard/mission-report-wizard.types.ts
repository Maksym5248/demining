import { Dayjs } from "dayjs";

import { IExplosiveObjectActionValueParams, IMapViewActionValueParams } from "~/stores";
import { IExplosiveActionValueParams } from "~/stores/stores/explosive";


export interface IMissionReportForm {
    approvedAt: Dayjs;
    approvedById:  string;
    number: number;
    subNumber?: number,
    executedAt: Dayjs;
    orderId: string;
    missionRequestId: string;
    checkedTerritory?: number;
    depthExamination?: number;
    uncheckedTerritory?: number;
    uncheckedReason?: string;
    mapView: Partial<IMapViewActionValueParams>;
    workStart: Dayjs;
    exclusionStart?: Dayjs;
    transportingStart?: Dayjs;
    destroyedStart?: Dayjs;
    workEnd: Dayjs;
    transportExplosiveObjectId?: string;
    transportHumansId?: string;
    mineDetectorId?: string,
    explosiveObjectActions: IExplosiveObjectActionValueParams[];
    squadLeaderId: string;
    squadIds: string[];
    address: string;
    explosiveActions: IExplosiveActionValueParams[];
}