import { IEmployeeDB, IEmployeeHistoryDB, IOrderDB, IMissionRequestDB } from "~/db"

export type IEmployeeDTO = IEmployeeDB
export type IEmployeeHistoryDTO = IEmployeeHistoryDB

export interface IOrderDTO extends Omit<IOrderDB, "signedById">{
    signedBy: IEmployeeHistoryDTO;
}

export type IOrderDTOParams = Omit<IOrderDB, 'updatedAt' | 'createdAt' | "id">

export type IMissionRequestDTO = IMissionRequestDB