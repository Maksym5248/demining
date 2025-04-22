import { type APPS, type IAppConfigDB, type ICountryDB, type IMaterialDB, type IStatusDB } from 'shared-my';

import { type IQuery, type IDBBase, type ISubscriptionDocument } from '~/common';

import { type IAppConfigDTO, type ICountryDTO } from '../dto';

export interface ICommonAPI {
    getAppConfig: (name: APPS) => Promise<IAppConfigDTO>;
    subscribeCountry: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<ICountryDTO>[]) => void) => Promise<void>;
    subscribeMaterial: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IMaterialDB>[]) => void) => Promise<void>;
    subscribeStatus: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IStatusDB>[]) => void) => Promise<void>;
}

export class CommonAPI implements ICommonAPI {
    constructor(
        private db: {
            app: IDBBase<IAppConfigDB>;
            country: IDBBase<ICountryDB>;
            material: IDBBase<IMaterialDB>;
            status: IDBBase<IStatusDB>;
        },
    ) {}

    subscribeCountry = (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<ICountryDTO>[]) => void) => {
        return this.db.country.subscribe(args, callback);
    };

    subscribeMaterial = (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IMaterialDB>[]) => void) => {
        return this.db.material.subscribe(args, callback);
    };

    subscribeStatus = (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<IStatusDB>[]) => void) => {
        return this.db.status.subscribe(args, callback);
    };

    async getAppConfig(name: APPS) {
        const res = await this.db.app.get(name);

        if (!res) {
            throw new Error('App config not found');
        }

        return res;
    }
}
