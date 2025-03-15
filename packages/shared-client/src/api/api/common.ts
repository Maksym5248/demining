import { type APPS, countries, type IAppConfigDB } from 'shared-my';

import { type IDBBase } from '~/common';

import { type ICountryDTO } from '../dto';

export interface ICommonAPI {
    getCountriesList: () => Promise<ICountryDTO[]>;
    getAppConfig: (name: APPS) => Promise<any>;
}

export class CommonAPI implements ICommonAPI {
    constructor(
        private db: {
            app: IDBBase<IAppConfigDB>;
        },
    ) {}
    async getCountriesList() {
        return countries;
    }

    async getAppConfig(name: APPS) {
        return this.db.app.get(name);
    }
}
