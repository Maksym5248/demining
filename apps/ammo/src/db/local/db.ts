import { TABLES, type IExplosiveObjectTypeDB, TABLES_DIR } from 'shared-my';
import { type IDB } from 'shared-my-client';

import { DBBase } from './db-base';

export interface IDBLocal extends Pick<IDB, 'init' | 'dropDb' | 'setLang' | 'explosiveObjectType'> {}

// Initialization table collection set language
// create wrawwer for db or integrate in to local db

export class DBLocal implements IDBLocal {
    explosiveObjectType = new DBBase<IExplosiveObjectTypeDB>(TABLES.EXPLOSIVE_OBJECT_TYPE);

    init = () => {};

    dropDb = () => {};

    setLang(lang: 'uk' | 'en') {
        const getCollection = (table: TABLES) => `${table}/${TABLES_DIR.LANG}/${lang}`;
        this.explosiveObjectType.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_TYPE));
    }
}
