import { type EMPLOYEE_TYPE } from 'shared-my/db';

export interface IEmployeeForm {
    firstName: string;
    type: EMPLOYEE_TYPE;
    lastName: string;
    position: string;
    rankId: string;
    surname: string;
}
