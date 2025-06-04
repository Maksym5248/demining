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
    type IBookAssetsDB,
} from 'shared-my';
import { type IDB } from 'shared-my-client';

import { DBBase } from './db-base';

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
        | 'bookAssets'
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
    bookAssets = new DBBase<IBookAssetsDB>(TABLES.BOOK_ASSETS);

    bookType = new DBBase<IBookTypeDB>(TABLES.BOOK_TYPE);
    country = new DBBase<ICountryDB>(TABLES.COUNTRY);
    explosiveDeviceType = new DBBase<IExplosiveDeviceTypeDB>(TABLES.EXPLOSIVE_DEVICE_TYPE);
    explosiveObjectComponent = new DBBase<IExplosiveObjectComponentDB>(TABLES.EXPLOSIVE_OBJECT_COMPONENT);
    material = new DBBase<IMaterialDB>(TABLES.MATERIAL);
    status = new DBBase<IStatusDB>(TABLES.STATUSES);
    rank = new DBBase<IRankDB>(TABLES.RANKS);

    init = async () => {
        return Promise.resolve();
    };

    async drop() {
        await Promise.all([
            this.explosiveObject.drop(),
            this.explosiveObjectDetails.drop(),
            this.explosiveObjectType.drop(),
            this.explosiveDevice.drop(),
            this.explosive.drop(),
            this.explosiveObjectClass.drop(),
            this.explosiveObjectClassItem.drop(),
            this.book.drop(),

            this.bookType.drop(),
            this.country.drop(),
            this.explosiveDeviceType.drop(),
            this.explosiveObjectComponent.drop(),
            this.material.drop(),
            this.status.drop(),
            this.rank.drop(),
        ]);
    }

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
