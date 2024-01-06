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
	IEquipmentActionDB
} from "~/db"

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
export type IExplosiveObjectActionDTOParams = Omit<IExplosiveObjectActionDB, keyof IExplosiveObjectDB>;

export type ITransportDTO = ITransportDB
export type ITransportActionDTO = ITransportActionDB

export type IEquipmentDTO = IEquipmentDB
export type IEquipmentActionDTO = IEquipmentActionDB


