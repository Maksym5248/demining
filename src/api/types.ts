import { Timestamp } from "firebase/firestore";

import { EXPLOSIVE_OBJECT_CATEGORY } from "~/constants";
import { 
	IEmployeeDB,
	IEmployeeActionDB,
	IOrderDB,
	IMissionRequestDB,
	IExplosiveObjectDB,
	IExplosiveObjectTypeDB,
	IExplosiveObjectActionDB,
	ITransportDB,
	ITransportActionDB,
	IEquipmentDB,
	IEquipmentActionDB,
	IMissionReportDB,
	IMapViewActionActionDB,
	IUserDB,
	IOrganizationDB
} from "~/db";

export type IEmployeeDTO = IEmployeeDB
export type IEmployeeActionDTO = IEmployeeActionDB

export interface IOrderDTO extends Omit<IOrderDB, "signedByActionId">{
    signedByAction: IEmployeeActionDTO;
}

export type IOrderDTOParams = Omit<IOrderDB, 'updatedAt' | 'createdAt' | "id" | "signedByActionId"> & {
	signedById: string
}

export type IMissionRequestDTO = IMissionRequestDB

export type IExplosiveObjectTypeDTO = IExplosiveObjectTypeDB

export interface IExplosiveObjectDTO extends Omit<IExplosiveObjectDB, "typeId">{
    type: IExplosiveObjectTypeDTO;
}

export interface IExplosiveObjectActionDTO extends Omit<IExplosiveObjectActionDB, "typeId">{
    type: IExplosiveObjectTypeDTO;
}

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

export interface IMissionReportDTO extends Omit<IMissionReportDB, "orderId" | "approvedByActionId"  | "missionRequestId" | "mapViewId" | "transportActionIds" | "equipmentActionIds" | "explosiveObjectActionIds" | "squadLeaderActionId" | "squadActionIds">{
    "order": IOrderDTO;
    "missionRequest": IMissionRequestDTO;
    "approvedByAction": IEmployeeActionDTO;
	"mapView": IMapViewActionDTO;
	"transportActions": ITransportActionDTO[];
	"equipmentActions": IEquipmentActionDTO[];
	"explosiveObjectActions": IExplosiveObjectActionDTO[];
	"squadLeaderAction": IEmployeeActionDTO;
	"squadActions": IEmployeeActionDTO[]
}

export interface IMapViewActionDTOParams  extends Omit<IMapViewActionDTO, "id" | "documentId"  | "documentType" | "updatedAt" | "createdAt">{}

export interface IMissionReportDTOParams {
    approvedAt: Timestamp;
    approvedById:  string;
    number: number;
    subNumber: number | undefined,
    executedAt: Timestamp;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | undefined;
    depthExamination: number |undefined;
    uncheckedTerritory: number |undefined;
    uncheckedReason: string | undefined;
    mapView: IMapViewActionDTOParams;
    workStart: Timestamp;
    exclusionStart: Timestamp | undefined;
    transportingStart: Timestamp | undefined;
    destroyedStart: Timestamp | undefined;
    workEnd: Timestamp;
    transportExplosiveObjectId?: string;
    transportHumansId?: string;
    mineDetectorId?: string,
    explosiveObjectActions: IExplosiveObjectActionDTOParams[];
    squadLeaderId: string;
    squadIds: string[];
    address: string;
}


export interface IMissionReportDTOParamsUpdate {
    id: string;
    approvedAt: Timestamp;
    approvedById:  string;
    number: number;
    subNumber: number | undefined,
    executedAt: Timestamp;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | undefined;
    depthExamination: number |undefined;
    uncheckedTerritory: number |undefined;
    uncheckedReason: string | undefined;
    mapView: IMapViewActionDTOParams;
    workStart: Timestamp;
    exclusionStart: Timestamp | undefined;
    transportingStart: Timestamp | undefined;
    destroyedStart: Timestamp | undefined;
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