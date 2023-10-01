import { IDataBase } from 'jsstore';

import { TABLES } from '~/constants';
import { CONFIG } from '~/config';

import { DBBase } from './db-base';
import { DBInit } from './db-init';
import { schemaEmployee } from './schema';
import { IEmployeeDB } from './types';

const getSchema = ():IDataBase => ({
    name: CONFIG.DB_NAME,
    tables: [schemaEmployee]
} as IDataBase)

export const DB = {
    init: () => DBInit.init(getSchema()),
    dropDb: () => DBInit.dropDb(),
    employee: new DBBase<IEmployeeDB>(DBInit.getDB(), TABLES.EMPLOYEE)
}