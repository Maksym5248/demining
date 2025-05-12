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

export interface IDBLocal
    extends Pick<
        IDB,
        | 'init'
        | 'dropDb'
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
    explosiveObject = new DBBase<IExplosiveObjectDB>(TABLES.EXPLOSIVE_OBJECT);
    explosiveObjectDetails = new DBBase<IExplosiveObjectDetailsDB>(TABLES.EXPLOSIVE_OBJECT_DETAILS);
    explosiveObjectType = new DBBase<IExplosiveObjectTypeDB>(TABLES.EXPLOSIVE_OBJECT_TYPE);
    explosiveDevice = new DBBase<IExplosiveDeviceDB>(TABLES.EXPLOSIVE_DEVICE);
    explosive = new DBBase<IExplosiveDB>(TABLES.EXPLOSIVE);
    explosiveObjectClass = new DBBase<IExplosiveObjectClassDB>(TABLES.EXPLOSIVE_OBJECT_CLASS);
    explosiveObjectClassItem = new DBBase<IExplosiveObjectClassItemDB>(TABLES.EXPLOSIVE_OBJECT_CLASS_ITEM);
    book = new DBBase<IBookDB>(TABLES.BOOK);

    bookType = new DBBase<IBookTypeDB>(TABLES.BOOK_TYPE);
    country = new DBBase<ICountryDB>(TABLES.COUNTRY);
    explosiveDeviceType = new DBBase<IExplosiveDeviceTypeDB>(TABLES.EXPLOSIVE_DEVICE_TYPE);
    explosiveObjectComponent = new DBBase<IExplosiveObjectComponentDB>(TABLES.EXPLOSIVE_OBJECT_COMPONENT);
    material = new DBBase<IMaterialDB>(TABLES.MATERIAL);
    status = new DBBase<IStatusDB>(TABLES.STATUSES);
    rank = new DBBase<IRankDB>(TABLES.RANKS);

    init = () => Promise.resolve();

    dropDb = () => {};

    setLang(lang: 'uk' | 'en') {
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
