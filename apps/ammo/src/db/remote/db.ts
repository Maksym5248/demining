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
    TABLES_DIR,
    type IBookTypeDB,
    type ICountryDB,
    type IExplosiveDeviceTypeDB,
    type IExplosiveObjectComponentDB,
    type IMaterialDB,
    type IStatusDB,
    type IRankDB,
    type IUserAccessDB,
    type IMemberDB,
    type ICommentDB,
} from 'shared-my';
import { type IDB } from 'shared-my-client';

import { Auth } from '~/services';

import { DBBase } from './db-base';

const organizationId: string | null = null;

const getCreateData = () => ({
    authorId: Auth.uuid(),
    organizationId,
    isDeleted: false,
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
            | 'book'
            | 'bookType'
            | 'country'
            | 'explosiveDeviceType'
            | 'explosiveObjectComponent'
            | 'material'
            | 'status'
            | 'rank'
            | 'comment'
            | 'app'
        >
{
    userInfo = new DBBase<IUserInfoDB>(TABLES.USER_INFO, []);
    userAccess = new DBBase<IUserAccessDB>(TABLES.USER_ACCESS);
    member = new DBBase<IMemberDB>(TABLES.MEMBER);

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

    comment = new DBBase<ICommentDB>(TABLES.COMMENT, [], getCreateData);

    app = new DBBase<IAppConfigDB>(TABLES.APP_CONFIG, [], undefined);

    bookType = new DBBase<IBookTypeDB>(TABLES.BOOK_TYPE, []);
    country = new DBBase<ICountryDB>(TABLES.COUNTRY, []);
    explosiveDeviceType = new DBBase<IExplosiveDeviceTypeDB>(TABLES.EXPLOSIVE_DEVICE_TYPE, []);
    explosiveObjectComponent = new DBBase<IExplosiveObjectComponentDB>(TABLES.EXPLOSIVE_OBJECT_COMPONENT, []);
    material = new DBBase<IMaterialDB>(TABLES.MATERIAL, []);
    status = new DBBase<IStatusDB>(TABLES.STATUSES, []);
    rank = new DBBase<IRankDB>(TABLES.RANKS, []);

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

    setLang(lang: 'uk' | 'en') {
        const getCollection = (table: TABLES) => `${table}/${TABLES_DIR.LANG}/${lang}`;

        this.bookType.setTableName(getCollection(TABLES.BOOK_TYPE));
        this.country.setTableName(getCollection(TABLES.COUNTRY));
        this.explosiveDeviceType.setTableName(getCollection(TABLES.EXPLOSIVE_DEVICE_TYPE));
        this.explosiveObjectComponent.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_COMPONENT));
        this.material.setTableName(getCollection(TABLES.MATERIAL));
        this.status.setTableName(getCollection(TABLES.STATUSES));
        this.comment.setTableName(getCollection(TABLES.COMMENT));

        this.explosiveObjectType.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_TYPE));
        this.explosiveObjectClass.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_CLASS));
        this.explosiveObjectClassItem.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_CLASS_ITEM));
        this.explosiveObject.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT));
        this.explosiveObjectDetails.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_DETAILS));
        this.explosiveDevice.setTableName(getCollection(TABLES.EXPLOSIVE_DEVICE));
        this.explosive.setTableName(getCollection(TABLES.EXPLOSIVE));
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
