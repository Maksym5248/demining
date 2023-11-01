import { SecureStorage, Storage } from '~/services';
import { DB, IEmployeeDB } from '~/db'

export interface IEnv {
  Storage: typeof Storage;
  SecureStorage: typeof SecureStorage;
  DB: IEmployeeDB;
}

export const env = {
  Storage,
  SecureStorage,
};