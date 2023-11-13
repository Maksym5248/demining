import { IDataBase } from 'jsstore';

import { TABLES } from '~/constants';
import { CONFIG } from '~/config';

import { DBBase } from './db-base';
import { DBInit } from './db-init';
import { schemaEmployee, schemaOrder, schemaMissionRequest } from './schema';
import { IEmployeeDB, IOrderDB, IMissionRequestDB } from './types';

const getSchema = ():IDataBase => ({
    name: CONFIG.DB_NAME,
    tables: [schemaEmployee, schemaOrder, schemaMissionRequest]
} as IDataBase)

export const DB = {
    init: () => DBInit.init(getSchema()),
    dropDb: () => DBInit.dropDb(),
    employee: new DBBase<IEmployeeDB>(DBInit.getDB(), TABLES.EMPLOYEE),
    missionRequest: new DBBase<IMissionRequestDB>(DBInit.getDB(), TABLES.MISSION_REQUEST),
    order: new DBBase<IOrderDB>(DBInit.getDB(), TABLES.ORDER),
}