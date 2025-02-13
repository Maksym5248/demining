import { makeAutoObservable } from 'mobx';

import { type DictionaryType, type ViewModel } from '~/types';

import { type IExplosiveObjectModel, ExplosiveObjectModel } from './containers';
import { sections } from './filter-dictionaries.type';

export interface IFilterDictionariesVM extends ViewModel {
    sections: DictionaryType[];
    section?: DictionaryType;
    setSection(id?: DictionaryType): void;
    explosiveObject: IExplosiveObjectModel;
}

export class FilterDictionariesVM implements IFilterDictionariesVM {
    section?: DictionaryType = undefined;
    explosiveObject: IExplosiveObjectModel = new ExplosiveObjectModel();

    constructor() {
        makeAutoObservable(this);
    }

    setSection(value?: DictionaryType) {
        this.section = value === this.section ? undefined : value;
    }

    get sections() {
        return sections;
    }
}

export const filterDictionariesVM = new FilterDictionariesVM();
