
import { IEmployeeType } from './employee-type';

export const createEmployeeType = (type: IEmployeeType): IEmployeeType => ({
  type: type.type,
  name: String(type.name) || '',
});
