import { DBLocal as DBLocalClass } from './local/db';
import { DBRemote as DBRemoteClass } from './remote/db';

export const DBRemote = new DBRemoteClass();
export const DBLocal = new DBLocalClass();
