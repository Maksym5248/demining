import { type APPS, type IAppConfigDB, type ICountryDB, type IMaterialDB, type IStatusDB } from 'shared-my';

import { type IQuery, type IDBRemote, type IDBLocal, type ISubscriptionDocument } from '~/common';
import { type ILogger, type IStorage } from '~/services';

import { type IAppConfigDTO, type ICountryDTO } from '../dto';
import { DBOfflineFirst, type IDBOfflineFirst } from '../offline';

export interface ICommonAPI {
    getAppConfig: (name: APPS) => Promise<IAppConfigDTO>;
    syncCountry: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<ICountryDTO>[]) => void) => Promise<void>;
    syncMaterial: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IMaterialDB>[]) => void) => Promise<void>;
    syncStatus: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IStatusDB>[]) => void) => Promise<void>;
}

interface IServices {
    logger: ILogger;
    storage: IStorage;
}
export class CommonAPI implements ICommonAPI {
    offlineCountry: IDBOfflineFirst<ICountryDB>;
    offlineMaterial: IDBOfflineFirst<IMaterialDB>;
    offlineStatus: IDBOfflineFirst<IStatusDB>;

    constructor(
        private dbRemote: {
            app: IDBRemote<IAppConfigDB>;
            country: IDBRemote<ICountryDB>;
            material: IDBRemote<IMaterialDB>;
            status: IDBRemote<IStatusDB>;
        },
        dbLocal: {
            country: IDBLocal<ICountryDB>;
            material: IDBLocal<IMaterialDB>;
            status: IDBLocal<IStatusDB>;
        },
        services: IServices,
    ) {
        this.offlineCountry = new DBOfflineFirst<ICountryDB>(dbRemote.country, dbLocal.country, services);
        this.offlineMaterial = new DBOfflineFirst<IMaterialDB>(dbRemote.material, dbLocal.material, services);
        this.offlineStatus = new DBOfflineFirst<IStatusDB>(dbRemote.status, dbLocal.status, services);
    }

    async getAppConfig(name: APPS): Promise<IAppConfigDTO> {
        const res = await this.dbRemote.app.get(name);

        if (!res) {
            throw new Error('App config not found');
        }

        return res;
    }

    syncCountry = (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<ICountryDTO>[]) => void) => {
        return this.offlineCountry.sync(args, callback);
    };

    syncMaterial = (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IMaterialDB>[]) => void) => {
        return this.offlineMaterial.sync(args, callback);
    };

    syncStatus = (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IStatusDB>[]) => void) => {
        return this.offlineStatus.sync(args, callback);
    };
}
