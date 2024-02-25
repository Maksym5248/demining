import { TABLES } from '~/constants';

import { DBBase } from './db-base';
import {
	IUserDB
} from '../types';

export const DBRemote = {
	user: new DBBase<IUserDB>(TABLES.USER),
}