import { makeAutoObservable } from 'mobx';

import { DictionaryType, type ViewModel } from '~/types';

import { sections } from './filter-dictionaries.type';

export interface IFilterDictionariesVM extends ViewModel {
    sections: DictionaryType[];
    section?: DictionaryType;
    setSection(id?: DictionaryType): void;
}

export class FilterDictionariesVM implements IFilterDictionariesVM {
    section?: DictionaryType = DictionaryType.ExplosiveObject;

    constructor() {
        makeAutoObservable(this);
    }

    setSection(value?: DictionaryType) {
        this.section = value;
    }

    get sections() {
        return sections;
    }
}

export const filterDictionariesVM = new FilterDictionariesVM();
