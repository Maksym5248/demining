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

import { CONFIG } from '~/config';

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
    connection: DBConnection = new DBConnection(CONFIG.DB_NAME);

    explosiveObject = new DBBase<IExplosiveObjectDB>(TABLES.EXPLOSIVE_OBJECT, ['name'], this.connection);
    explosiveObjectDetails = new DBBase<IExplosiveObjectDetailsDB>(TABLES.EXPLOSIVE_OBJECT_DETAILS, [], this.connection);
    explosiveObjectType = new DBBase<IExplosiveObjectTypeDB>(TABLES.EXPLOSIVE_OBJECT_TYPE, ['name', 'fullName'], this.connection);
    explosiveDevice = new DBBase<IExplosiveDeviceDB>(TABLES.EXPLOSIVE_DEVICE, ['name'], this.connection);
    explosive = new DBBase<IExplosiveDB>(TABLES.EXPLOSIVE, ['name'], this.connection);
    explosiveObjectClass = new DBBase<IExplosiveObjectClassDB>(TABLES.EXPLOSIVE_OBJECT_CLASS, ['name'], this.connection);
    explosiveObjectClassItem = new DBBase<IExplosiveObjectClassItemDB>(TABLES.EXPLOSIVE_OBJECT_CLASS_ITEM, ['name'], this.connection);
    book = new DBBase<IBookDB>(TABLES.BOOK, ['name'], this.connection);
    bookAssets = new DBBase<IBookAssetsDB>(TABLES.BOOK_ASSETS, [], this.connection);

    bookType = new DBBase<IBookTypeDB>(TABLES.BOOK_TYPE, [], this.connection);
    country = new DBBase<ICountryDB>(TABLES.COUNTRY, [], this.connection);
    explosiveDeviceType = new DBBase<IExplosiveDeviceTypeDB>(TABLES.EXPLOSIVE_DEVICE_TYPE, [], this.connection);
    explosiveObjectComponent = new DBBase<IExplosiveObjectComponentDB>(TABLES.EXPLOSIVE_OBJECT_COMPONENT, [], this.connection);
    material = new DBBase<IMaterialDB>(TABLES.MATERIAL, [], this.connection);
    status = new DBBase<IStatusDB>(TABLES.STATUSES, [], this.connection);
    rank = new DBBase<IRankDB>(TABLES.RANKS, [], this.connection);

    init = async (lang: 'uk' | 'en') => {
        this.setLang(lang);

        const dbs = [
            this.explosiveObjectType,
            this.explosiveObject,
            this.explosiveDevice,
            this.explosive,
            this.explosiveObjectClass,
            this.explosiveObjectClassItem,
            this.book,
            this.bookAssets,
            this.bookType,
            this.country,
            this.explosiveDeviceType,
            this.explosiveObjectComponent,
            this.material,
            this.status,
            this.rank,
            this.explosiveObjectDetails,
        ];

        await this.connection.init(db => {
            const names = dbs.map(db => db.tableName);

            names.forEach(tableName => {
                if (!db.objectStoreNames.contains(tableName)) {
                    db.createObjectStore(tableName, { keyPath: 'id' });
                }
            });
        });
    };

    async drop() {
        this.connection.drop();
    }

    async setLang(lang: 'uk' | 'en') {
        const getCollection = (table: string) => `${table}/${TABLES_DIR.LANG}/${lang}`;

        await Promise.all([
            this.explosiveObjectType.setTableName(getCollection(this.explosiveObjectType.tableName)),
            this.bookType.setTableName(getCollection(this.bookType.tableName)),
            this.country.setTableName(getCollection(this.country.tableName)),
            this.explosiveDeviceType.setTableName(getCollection(this.explosiveDeviceType.tableName)),
            this.explosiveObjectComponent.setTableName(getCollection(this.explosiveObjectComponent.tableName)),
            this.material.setTableName(getCollection(this.material.tableName)),
            this.status.setTableName(getCollection(this.status.tableName)),
            this.explosiveObjectType.setTableName(getCollection(this.explosiveObjectType.tableName)),
            this.explosiveObjectClass.setTableName(getCollection(this.explosiveObjectClass.tableName)),
            this.explosiveObjectClassItem.setTableName(getCollection(this.explosiveObjectClassItem.tableName)),
            this.explosiveObject.setTableName(getCollection(this.explosiveObject.tableName)),
            this.explosiveObjectDetails.setTableName(getCollection(this.explosiveObjectDetails.tableName)),
            this.explosiveDevice.setTableName(getCollection(this.explosiveDevice.tableName)),
            this.explosive.setTableName(getCollection(this.explosive.tableName)),
        ]);
    }
}
