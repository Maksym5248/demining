import { countries } from 'shared-my';

import { type ICountryDTO } from '../dto';

export interface ICommonAPI {
    getCountriesList: () => Promise<ICountryDTO[]>;
}

export class CommonAPI implements ICommonAPI {
    async getCountriesList() {
        return countries;
    }
}
