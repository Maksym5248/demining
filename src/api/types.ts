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
	IMapViewDB
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
export type IMapViewDTO = IMapViewDB;

export interface IMissionReportDTO extends Omit<IMissionReportDB, "approvedByActionId"  | "missionRequestId" | "mapViewId" | "transportActionIds" | "equipmentActionIds" | "explosiveObjectActionIds" | "squadLeaderActionId" | "squadActionIds">{
	"approvedByAction": IEmployeeActionDTO;
	"missionRequest": IMissionRequestDTO;
	"mapView": IMapViewDTO;
	"transportActions": ITransportActionDTO[];
	"equipmentActions": IEquipmentActionDTO[];
	"explosiveObjectActions": IExplosiveObjectActionDTO[];
	"squadLeaderAction": IEmployeeActionDTO;
	"squadActions": IEmployeeActionDTO[]
}

export interface IMapViewDTOParams  extends Omit<IMapViewDTO, "id" | "documentId"  | "documentType" | "updatedAt" | "createdAt">{}

export interface IMissionReportDTOParams {
    approvedAt: Date;
    approvedById:  string;
    number: number;
    subNumber: number | undefined,
    executedAt: Date;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | undefined;
    depthExamination: number |undefined;
    uncheckedTerritory: number |undefined;
    uncheckedReason: string | undefined;
    mapView: IMapViewDTOParams;
    workStart: Date;
    exclusionStart: Date | undefined;
    transportingStart: Date | undefined;
    destroyedStart: Date | undefined;
    workEnd: Date;
    transportExplosiveObjectId: string;
    transportHumansId: string;
    mineDetectorId: string,
    explosiveObjectActions: IExplosiveObjectActionDTOParams[];
    squadLeadId: string;
    workersIds: string[];
    address: string;
}


