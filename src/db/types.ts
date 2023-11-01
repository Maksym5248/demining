import { EMPLOYEE_TYPE } from "~/constants"

export interface IEmployeeDB {
    id: string;
    type: EMPLOYEE_TYPE;
    firstName: string;
    lastName: string;
    surname: string;
    rank: string;
    position: string;
    createdAt: Date;
    updatedAt: Date;
}