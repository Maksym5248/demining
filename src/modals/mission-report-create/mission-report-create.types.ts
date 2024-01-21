import { Dayjs } from "dayjs";

import { IExplosiveObjectActionDTOParams, IMapViewDTOParams } from "~/api";


export interface IMissionReportForm {
    approvedAt: Dayjs;
    approvedById:  string;
    number: number;
    subNumber: number | undefined,
    executedAt: Dayjs;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | undefined;
    depthExamination: number |undefined;
    uncheckedTerritory: number |undefined;
    uncheckedReason: string | undefined;
    mapView: Partial<IMapViewDTOParams>;
    workStart: Dayjs | undefined;
    exclusionStart: Dayjs | undefined;
    transportingStart: Dayjs | undefined;
    destroyedStart: Dayjs | undefined;
    workEnd: Dayjs | undefined;
    transportExplosiveObjectId: string;
    transportHumansId: string;
    mineDetectorId: string,
    explosiveObjectActions: IExplosiveObjectActionDTOParams[];
    squadLeadId: string;
    workersIds: string[];
    address: string;
}