import {
    TABLES,
    type IExplosiveObjectTypeDB,
    TABLES_DIR,
    type IExplosiveDeviceDB,
    type IExplosiveObjectClassItemDB,
    type IExplosiveObjectClassDB,
    type IExplosiveDB,
    type IExplosiveObjectDB,
    type IBookDB,
    type IBookTypeDB,
    type ICountryDB,
    type IExplosiveDeviceTypeDB,
    type IExplosiveObjectComponentDB,
    type IMaterialDB,
    type IStatusDB,
    type IRankDB,
    type IExplosiveObjectDetailsDB,
} from 'shared-my';
import { type IDB } from 'shared-my-client';

import { DBBase } from './db-base';
import { DBConnection } from './db.connetion';

export interface IDBLocal
    extends Pick<
        IDB,
        | 'init'
        | 'drop'
        | 'setLang'
        | 'explosiveObjectType'
        | 'explosiveObject'
        | 'explosiveDevice'
        | 'explosive'
        | 'explosiveObjectClass'
        | 'explosiveObjectClassItem'
        | 'book'
        | 'bookType'
        | 'country'
        | 'explosiveDeviceType'
        | 'explosiveObjectComponent'
        | 'material'
        | 'status'
        | 'rank'
    > {}

export class DBLocal implements IDBLocal {
    connection: DBConnection = new DBConnection();

    explosiveObject = new DBBase<IExplosiveObjectDB>(TABLES.EXPLOSIVE_OBJECT, this.connection);
    explosiveObjectDetails = new DBBase<IExplosiveObjectDetailsDB>(TABLES.EXPLOSIVE_OBJECT_DETAILS, this.connection);
    explosiveObjectType = new DBBase<IExplosiveObjectTypeDB>(TABLES.EXPLOSIVE_OBJECT_TYPE, this.connection);
    explosiveDevice = new DBBase<IExplosiveDeviceDB>(TABLES.EXPLOSIVE_DEVICE, this.connection);
    explosive = new DBBase<IExplosiveDB>(TABLES.EXPLOSIVE, this.connection);
    explosiveObjectClass = new DBBase<IExplosiveObjectClassDB>(TABLES.EXPLOSIVE_OBJECT_CLASS, this.connection);
    explosiveObjectClassItem = new DBBase<IExplosiveObjectClassItemDB>(TABLES.EXPLOSIVE_OBJECT_CLASS_ITEM, this.connection);
    book = new DBBase<IBookDB>(TABLES.BOOK, this.connection);

    bookType = new DBBase<IBookTypeDB>(TABLES.BOOK_TYPE, this.connection);
    country = new DBBase<ICountryDB>(TABLES.COUNTRY, this.connection);
    explosiveDeviceType = new DBBase<IExplosiveDeviceTypeDB>(TABLES.EXPLOSIVE_DEVICE_TYPE, this.connection);
    explosiveObjectComponent = new DBBase<IExplosiveObjectComponentDB>(TABLES.EXPLOSIVE_OBJECT_COMPONENT, this.connection);
    material = new DBBase<IMaterialDB>(TABLES.MATERIAL, this.connection);
    status = new DBBase<IStatusDB>(TABLES.STATUSES, this.connection);
    rank = new DBBase<IRankDB>(TABLES.RANKS, this.connection);

    init = async () => {
        await this.connection.init();

        await Promise.all([
            this.explosiveObject.init(),
            this.explosiveObjectDetails.init(),
            this.explosiveObjectType.init(),
            this.explosiveDevice.init(),
            this.explosive.init(),
            this.explosiveObjectClass.init(),
            this.explosiveObjectClassItem.init(),
            this.book.init(),
            this.bookType.init(),
            this.country.init(),
            this.explosiveDeviceType.init(),
            this.explosiveObjectComponent.init(),
            this.material.init(),
            this.status.init(),
            this.rank.init(),
        ]);
    };

    async drop() {
        this.connection.drop();
    }

    async setLang(lang: 'uk' | 'en') {
        const getCollection = (table: TABLES) => `${table}/${TABLES_DIR.LANG}/${lang}`;
        this.explosiveObjectType.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_TYPE));

        this.bookType.setTableName(getCollection(TABLES.BOOK_TYPE));
        this.country.setTableName(getCollection(TABLES.COUNTRY));
        this.explosiveDeviceType.setTableName(getCollection(TABLES.EXPLOSIVE_DEVICE_TYPE));
        this.explosiveObjectComponent.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_COMPONENT));
        this.material.setTableName(getCollection(TABLES.MATERIAL));
        this.status.setTableName(getCollection(TABLES.STATUSES));

        this.explosiveObjectType.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_TYPE));
        this.explosiveObjectClass.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_CLASS));
        this.explosiveObjectClassItem.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_CLASS_ITEM));
        this.explosiveObject.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT));
        this.explosiveObjectDetails.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_DETAILS));
        this.explosiveDevice.setTableName(getCollection(TABLES.EXPLOSIVE_DEVICE));
        this.explosive.setTableName(getCollection(TABLES.EXPLOSIVE));
    }
}
