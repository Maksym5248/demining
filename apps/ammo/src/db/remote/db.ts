import { firebase, getFirestore } from '@react-native-firebase/firestore';
import {
    TABLES,
    type IExplosiveObjectTypeDB,
    type IExplosiveDeviceDB,
    type IExplosiveObjectDB,
    type IExplosiveObjectClassDB,
    type IExplosiveObjectClassItemDB,
    type IExplosiveDB,
    type IExplosiveObjectActionDB,
    type IExplosiveDeviceActionDB,
    type IUserDB,
    type IBookDB,
} from 'shared-my';
import { type IDB } from 'shared-my-client';

import { DBBase } from './db-base';

const organizationId: string | null = null;

const getCreateData = () => ({
    authorId: '',
    organizationId,
});

export class DBRemote
    implements
        Pick<
            IDB,
            | 'init'
            | 'dropDb'
            | 'setOrganizationId'
            | 'removeOrganizationId'
            | 'batchStart'
            | 'batchCommit'
            | 'explosiveObjectType'
            | 'explosiveObjectClass'
            | 'explosiveObjectClassItem'
            | 'explosiveObject'
            | 'explosiveObjectAction'
            | 'explosiveDevice'
            | 'explosiveDeviceAction'
            | 'explosive'
            | 'user'
        >
{
    user = new DBBase<IUserDB>(TABLES.USER, ['email']);

    explosiveObjectType = new DBBase<IExplosiveObjectTypeDB>(TABLES.EXPLOSIVE_OBJECT_TYPE, ['name', 'fullName'], getCreateData, undefined);

    explosiveObjectClass = new DBBase<IExplosiveObjectClassDB>(TABLES.EXPLOSIVE_OBJECT_CLASS, ['name'], getCreateData, undefined);

    explosiveObjectClassItem = new DBBase<IExplosiveObjectClassItemDB>(
        TABLES.EXPLOSIVE_OBJECT_CLASS_ITEM,
        ['name'],
        getCreateData,
        undefined,
    );

    explosiveObject = new DBBase<IExplosiveObjectDB>(TABLES.EXPLOSIVE_OBJECT, ['name'], getCreateData, undefined);

    explosiveObjectAction = new DBBase<IExplosiveObjectActionDB>(TABLES.EXPLOSIVE_OBJECT_ACTION, [], getCreateData);

    explosiveDevice = new DBBase<IExplosiveDeviceDB>(TABLES.EXPLOSIVE_DEVICE, ['name'], getCreateData);

    explosiveDeviceAction = new DBBase<IExplosiveDeviceActionDB>(TABLES.EXPLOSIVE_DEVICE_ACTION, [], getCreateData);

    explosive = new DBBase<IExplosiveDB>(TABLES.EXPLOSIVE, ['name'], getCreateData);

    book = new DBBase<IBookDB>(TABLES.BOOK, ['name'], getCreateData);

    init = () => {
        getFirestore().settings({
            persistence: true,
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
            ssl: true,
        });

        return Promise.resolve();
    };

    dropDb = () => Promise.resolve();

    setOrganizationId() {
        /** WEB */
    }

    removeOrganizationId() {
        /** WEB */
    }

    private setBatch() {
        /** WEB */
    }

    batchStart() {
        /** WEB */
    }

    async batchCommit() {
        /** WEB */
    }
}
