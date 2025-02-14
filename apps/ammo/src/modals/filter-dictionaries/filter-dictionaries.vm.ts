import { makeAutoObservable } from 'mobx';

import { type IDictionatyFilter, type DictionaryType, type ViewModel } from '~/types';

import { type IExplosiveObjectModel, ExplosiveDeviceModel, ExplosiveObjectModel, type IExplosiveDeviceModel } from './containers';
import { sections } from './filter-dictionaries.type';

export interface IFilterDictionariesVM extends ViewModel {
    types: DictionaryType[];
    type?: DictionaryType;
    setType(id?: DictionaryType): void;
    clear(): void;
    explosiveObject: IExplosiveObjectModel;
    explosiveDevice: IExplosiveDeviceModel;
    filters: IDictionatyFilter;
}

export class FilterDictionariesVM implements IFilterDictionariesVM {
    type?: DictionaryType = undefined;
    explosiveObject: IExplosiveObjectModel = new ExplosiveObjectModel();
    explosiveDevice: IExplosiveDeviceModel = new ExplosiveDeviceModel();

    constructor() {
        makeAutoObservable(this);
    }

    init(filter: Partial<IDictionatyFilter>) {
        this.type = filter?.type;
        this.explosiveObject.setFilters(filter?.explosiveObject);
        this.explosiveDevice.setFilters(filter?.explosiveDevice);
    }

    clear() {
        this.type = undefined;
        this.explosiveObject.clear();
        this.explosiveDevice.clear();
    }

    unmount() {
        this.clear();
    }

    setType(value?: DictionaryType) {
        if (value !== this.type) {
            this.explosiveObject.clear();
        }

        this.type = value === this.type ? undefined : value;
    }

    get filters() {
        return {
            type: this.type,
            explosiveObject: this.explosiveObject.filters,
            explosiveDevice: this.explosiveDevice.filters,
        };
    }

    get types() {
        return sections;
    }
}

export const filterDictionariesVM = new FilterDictionariesVM();
