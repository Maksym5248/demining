import { TABLES } from '~/constants';

import { DBBase } from './db-base';
import {
	IOrganizationDB,
	IUserDB
} from '../types';

export const DBRemote = {
	user: new DBBase<IUserDB>(TABLES.USER),
	organization: new DBBase<IOrganizationDB>(TABLES.ORGANIZATION),
}