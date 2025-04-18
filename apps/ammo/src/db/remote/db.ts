import { getApp } from '@react-native-firebase/app';
import { firebase, type FirebaseFirestoreTypes, getFirestore, initializeFirestore, writeBatch } from '@react-native-firebase/firestore';
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
    type IUserInfoDB,
    type IBookDB,
    type IExplosiveObjectDetailsDB,
    type IAppConfigDB,
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
            | 'explosiveObjectDetails'
            | 'explosiveObjectAction'
            | 'explosiveDevice'
            | 'explosiveDeviceAction'
            | 'explosive'
            | 'userInfo'
            | 'app'
        >
{
    userInfo = new DBBase<IUserInfoDB>(TABLES.USER_INFO, ['email']);

    explosiveObjectType = new DBBase<IExplosiveObjectTypeDB>(TABLES.EXPLOSIVE_OBJECT_TYPE, ['name', 'fullName'], getCreateData, undefined);

    explosiveObjectClass = new DBBase<IExplosiveObjectClassDB>(TABLES.EXPLOSIVE_OBJECT_CLASS, ['name'], getCreateData, undefined);

    explosiveObjectClassItem = new DBBase<IExplosiveObjectClassItemDB>(
        TABLES.EXPLOSIVE_OBJECT_CLASS_ITEM,
        ['name'],
        getCreateData,
        undefined,
    );

    explosiveObject = new DBBase<IExplosiveObjectDB>(TABLES.EXPLOSIVE_OBJECT, ['name'], getCreateData, undefined);

    explosiveObjectDetails = new DBBase<IExplosiveObjectDetailsDB>(TABLES.EXPLOSIVE_OBJECT_DETAILS, [], getCreateData, undefined);

    explosiveObjectAction = new DBBase<IExplosiveObjectActionDB>(TABLES.EXPLOSIVE_OBJECT_ACTION, [], getCreateData);

    explosiveDevice = new DBBase<IExplosiveDeviceDB>(TABLES.EXPLOSIVE_DEVICE, ['name'], getCreateData);

    explosiveDeviceAction = new DBBase<IExplosiveDeviceActionDB>(TABLES.EXPLOSIVE_DEVICE_ACTION, [], getCreateData);

    explosive = new DBBase<IExplosiveDB>(TABLES.EXPLOSIVE, ['name'], getCreateData);

    book = new DBBase<IBookDB>(TABLES.BOOK, ['name'], getCreateData);

    app = new DBBase<IAppConfigDB>(TABLES.APP_CONFIG, [], undefined);

    batch: FirebaseFirestoreTypes.WriteBatch | null = null;

    init = () => {
        initializeFirestore(getApp(), {
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

    private setBatch(batch: FirebaseFirestoreTypes.WriteBatch | null) {
        this.batch = batch;

        this.userInfo.setBatch(batch);
        this.explosiveObject.setBatch(batch);
        this.explosiveObjectDetails.setBatch(batch);
        this.explosiveDevice.setBatch(batch);
        this.explosive.setBatch(batch);
        this.explosiveObjectAction.setBatch(batch);
        this.explosiveDeviceAction.setBatch(batch);
    }

    batchStart() {
        const batch = writeBatch(getFirestore());
        this.setBatch(batch);
    }

    async batchCommit() {
        await this.batch?.commit();
        this.setBatch(null);
    }
}
