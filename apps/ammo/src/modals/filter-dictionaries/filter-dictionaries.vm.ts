import { makeAutoObservable } from 'mobx';

import { type IDictionatyFilter, type DictionaryType, type ViewModel } from '~/types';

import { type IExplosiveObjectModel, ExplosiveObjectModel } from './containers';
import { sections } from './filter-dictionaries.type';

export interface IFilterDictionariesVM extends ViewModel {
    types: DictionaryType[];
    type?: DictionaryType;
    setType(id?: DictionaryType): void;
    explosiveObject: IExplosiveObjectModel;
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
        this.type = value === this.type ? undefined : value;
    }

    get types() {
        return sections;
    }
}

export const filterDictionariesVM = new FilterDictionariesVM();
