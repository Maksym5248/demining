import { type APPS, countries, type IAppConfigDB } from 'shared-my';

import { type IDBBase } from '~/common';

import { type IAppConfigDTO, type ICountryDTO } from '../dto';

export interface ICommonAPI {
    getCountriesList: () => Promise<ICountryDTO[]>;
    getAppConfig: (name: APPS) => Promise<IAppConfigDTO>;
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
        const res = await this.db.app.get(name);

        if (!res) {
            throw new Error('App config not found');
        }

        return res;
    }
}
