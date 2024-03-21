import { Timestamp } from "firebase/firestore";

import { EXPLOSIVE_OBJECT_CATEGORY } from "~/constants";
import { 
	IEmployeeDB,
	IEmployeeActionDB,
	IOrderDB,
	IMissionRequestDB,
	IExplosiveObjectDB,
	IExplosiveObjectActionDB,
	ITransportDB,
	ITransportActionDB,
	IEquipmentDB,
	IEquipmentActionDB,
	IMissionReportDB,
	IMapViewActionActionDB,
	IUserDB,
	IOrganizationDB,
	IDocumentDB,
	IExplosiveActionDB,
	IExplosiveDB
} from "~/db";

export type IEmployeeDTO = IEmployeeDB
export type IEmployeeActionDTO = IEmployeeActionDB

export interface IOrderPreviewDTO extends IOrderDB {}

export interface IOrderDTO extends IOrderPreviewDTO {
    signedByAction: IEmployeeActionDTO;
}

export type IOrderDTOParams = Omit<IOrderDB, 'updatedAt' | 'createdAt' | "id" | "signedByActionId"> & {
	signedById: string
}

export type IMissionRequestDTO = IMissionRequestDB

export interface IExplosiveObjectDTO extends IExplosiveObjectDB {};

export interface IExplosiveObjectActionDTO extends IExplosiveObjectActionDB  {};

export interface IExplosiveDTO extends IExplosiveDB {};

export interface IExplosiveActionDTO extends IExplosiveActionDB {};

export type IExplosiveObjectDTOParams = IExplosiveObjectDB;
export interface IExplosiveObjectActionDTOParams {
    id?: string;
    explosiveObjectId: string;
    quantity: number;
    category: EXPLOSIVE_OBJECT_CATEGORY;
    isDiscovered: boolean;
    isTransported: boolean;
    isDestroyed: boolean;
};

export type ITransportDTO = ITransportDB;
export type ITransportActionDTO = ITransportActionDB;
;
export type IEquipmentDTO = IEquipmentDB;
export type IEquipmentActionDTO = IEquipmentActionDB;
export type IMapViewActionDTO = IMapViewActionActionDB;
export type IDocumentDTO = IDocumentDB;

export interface IMissionReportPreviewDTO extends Omit<IMissionReportDB, "orderId"  | "missionRequestId"> {}
export interface IMissionReportDTO extends IMissionReportPreviewDTO {
    "order": IOrderDTO;
    "missionRequest": IMissionRequestDTO;
    "approvedByAction": IEmployeeActionDTO;
	"mapView": IMapViewActionDTO;
	"transportActions": ITransportActionDTO[];
	"equipmentActions": IEquipmentActionDTO[];
	"explosiveObjectActions": IExplosiveObjectActionDTO[];
	"squadLeaderAction": IEmployeeActionDTO;
	"squadActions": IEmployeeActionDTO[];
    "explosiveActions": IExplosiveActionDTO[]
}

export interface IMapViewActionDTOParams  extends Omit<IMapViewActionDTO, "id" | "documentId"  | "documentType" | "updatedAt" | "createdAt">{}
export interface IExplosiveActionDTOParams {
    id?: string;
    explosiveId: string;
    weight: number | null; /* in kilograms */
    quantity: number | null;
}

export interface IMissionReportDTOParams {
    approvedAt: Timestamp;
    approvedById:  string;
    number: number;
    subNumber: number | null,
    executedAt: Timestamp;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | null;
    depthExamination: number |null;
    uncheckedTerritory: number |null;
    uncheckedReason: string | null;
    mapView: IMapViewActionDTOParams;
    workStart: Timestamp;
    exclusionStart: Timestamp | null;
    transportingStart: Timestamp | null;
    destroyedStart: Timestamp | null;
    workEnd: Timestamp;
    transportExplosiveObjectId?: string;
    transportHumansId?: string;
    mineDetectorId?: string,
    explosiveObjectActions: IExplosiveObjectActionDTOParams[];
    squadLeaderId: string;
    squadIds: string[];
    explosiveActions?: IExplosiveActionDTOParams[];
    address: string;
}


export interface IMissionReportDTOParamsUpdate {
    id: string;
    approvedAt: Timestamp;
    approvedById:  string;
    number: number;
    subNumber: number | null,
    executedAt: Timestamp;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | null;
    depthExamination: number |null;
    uncheckedTerritory: number |null;
    uncheckedReason: string | null;
    mapView: IMapViewActionDTOParams;
    workStart: Timestamp;
    exclusionStart: Timestamp | null;
    transportingStart: Timestamp | null;
    destroyedStart: Timestamp | null;
    workEnd: Timestamp;
    transportExplosiveObjectId: string;
    transportHumansId: string;
    mineDetectorId: string,
    explosiveObjectActions: IExplosiveObjectActionDTOParams[];
    squadLeaderId: string;
    squadIds: string[];
    address: string; 
}

export interface ICurrentUserDTO extends Omit<IUserDB, "organizationId">  {
    organization: IUserOrganizationDTO | null;
}

export interface IUserDTO extends IUserDB {}

export interface IOrganizationDTO extends Omit<IOrganizationDB, "membersIds"> {}

export interface IUserOrganizationDTO extends Omit<IOrganizationDB, "membersIds"> {}

export interface ICreateOrganizationDTO extends Pick<IOrganizationDB, "name"> {}
export interface ICreateOrganizationMembersDTO extends Pick<IOrganizationDB, "membersIds"> {}