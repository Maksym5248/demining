import { EMPLOYEE_TYPE } from '~/constants';

export interface IEmployeeForm {
    firstName: string;
    type: EMPLOYEE_TYPE;
    lastName: string;
    position: string;
    rankId: string;
    surname: string;
}
