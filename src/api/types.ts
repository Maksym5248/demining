import { 
    IEmployeeDB,
    IEmployeeHistoryDB,
    IOrderDB,
    IMissionRequestDB,
    IExplosiveObjectDB,
    IExplosiveObjectTypeDB,
    ITransportDB,
    IEquipmentDB
} from "~/db"

export type IEmployeeDTO = IEmployeeDB
export type IEmployeeHistoryDTO = IEmployeeHistoryDB

export interface IOrderDTO extends Omit<IOrderDB, "signedById">{
    signedBy: IEmployeeHistoryDTO;
}

export type IOrderDTOParams = Omit<IOrderDB, 'updatedAt' | 'createdAt' | "id">

export type IMissionRequestDTO = IMissionRequestDB

export type IExplosiveObjectTypeDTO = IExplosiveObjectTypeDB

export interface IExplosiveObjectDTO extends Omit<IExplosiveObjectDB, "typeId">{
    type: IExplosiveObjectTypeDTO;
}

export type IExplosiveObjectDTOParams = IExplosiveObjectDB;
export type ITransportDTO = ITransportDB
export type IEquipmentDTO = IEquipmentDB

