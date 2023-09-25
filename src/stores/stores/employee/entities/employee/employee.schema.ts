import { IEmployee } from './employee';

export const createEmployee = (employee: IEmployee): IEmployee => ({
  id: employee.id,
  firstName: String(employee.firstName) || '',
  lastName: String(employee.lastName) || '',
  surname: String(employee.lastName) || '',
  rank: employee.rank || '',
  position: employee.position || '',
});
