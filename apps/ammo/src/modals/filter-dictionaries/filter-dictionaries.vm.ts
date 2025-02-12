import { makeAutoObservable } from 'mobx';

import { type DictionaryType, type ViewModel } from '~/types';

import { sections } from './filter-dictionaries.type';

export interface IFilterDictionariesVM extends ViewModel {
    sections: DictionaryType[];
    section?: DictionaryType;
    setSection(id?: DictionaryType): void;
}

export class FilterDictionariesVM implements IFilterDictionariesVM {
    section?: DictionaryType = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    setSection(value?: DictionaryType) {
        console.log('option', value);
        this.section = value;
        console.log('option 1', this.section);
    }

    get sections() {
        return sections;
    }
}

export const filterDictionariesVM = new FilterDictionariesVM();
