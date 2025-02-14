import { makeAutoObservable } from 'mobx';

import { type IDictionatyFilter, type DictionaryType, type ViewModel } from '~/types';

import { type IExplosiveObjectModel, ExplosiveObjectModel } from './containers';
import { sections } from './filter-dictionaries.type';

export interface IFilterDictionariesVM extends ViewModel {
    types: DictionaryType[];
    type?: DictionaryType;
    setType(id?: DictionaryType): void;
    explosiveObject: IExplosiveObjectModel;
    filters: IDictionatyFilter;
}

export class FilterDictionariesVM implements IFilterDictionariesVM {
    type?: DictionaryType = undefined;
    explosiveObject: IExplosiveObjectModel = new ExplosiveObjectModel();

    constructor() {
        makeAutoObservable(this);
    }

    init(filter: Partial<IDictionatyFilter>) {
        this.type = filter?.type;
        this.explosiveObject.setFilters(filter?.explosiveObject);
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
        };
    }

    get types() {
        return sections;
    }
}

export const filterDictionariesVM = new FilterDictionariesVM();
