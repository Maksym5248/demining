import { Dayjs } from "dayjs";

import { ICircle, ILatLng } from "~/types";

import { IExplosiveObjectActionListItem } from "./components";

export interface IMapView {
    marker?: ILatLng;
    circle?: ICircle;
    zoom: number;
}

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
    mapView: IMapView;
    workStart: Dayjs | undefined;
    exclusionStart: Dayjs | undefined;
    transportingStart: Dayjs | undefined;
    destroyedStart: Dayjs | undefined;
    workEnd: Dayjs | undefined;
    transportExplosiveObjectId: string;
    transportHumansId: string;
    mineDetectorId: string,
    explosiveObjectActions: IExplosiveObjectActionListItem[];
    squadLeadId: string;
    workersIds: string[];
}