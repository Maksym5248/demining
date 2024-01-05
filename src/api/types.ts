import { 
	IEmployeeDB,
	IEmployeeHistoryDB,
	IOrderDB,
	IMissionRequestDB,
	IExplosiveObjectDB,
	IExplosiveObjectTypeDB,
	IExplosiveObjectHistoryDB,
	ITransportDB,
	ITransportHistoryDB,
	IEquipmentDB,
	IEquipmentHistoryDB
} from "~/db"

export type IEmployeeDTO = IEmployeeDB
export type IEmployeeHistoryDTO = IEmployeeHistoryDB

export interface IOrderDTO extends Omit<IOrderDB, "signedByHistoryId">{
    signedByHistory: IEmployeeHistoryDTO;
}

export type IOrderDTOParams = Omit<IOrderDB, 'updatedAt' | 'createdAt' | "id" | "signedByHistoryId"> & {
	signedById: string
}

export type IMissionRequestDTO = IMissionRequestDB

export type IExplosiveObjectTypeDTO = IExplosiveObjectTypeDB

export interface IExplosiveObjectDTO extends Omit<IExplosiveObjectDB, "typeId">{
    type: IExplosiveObjectTypeDTO;
}

export interface IExplosiveObjectHistoryDTO extends Omit<IExplosiveObjectHistoryDB, "typeId">{
    type: IExplosiveObjectTypeDTO;
}

export type IExplosiveObjectDTOParams = IExplosiveObjectDB;
export type IExplosiveObjectHistoryDTOParams = Omit<IExplosiveObjectHistoryDB, keyof IExplosiveObjectDB>;

export type ITransportDTO = ITransportDB
export type ITransportHistoryDTO = ITransportHistoryDB

export type IEquipmentDTO = IEquipmentDB
export type IEquipmentHistoryDTO = IEquipmentHistoryDB


