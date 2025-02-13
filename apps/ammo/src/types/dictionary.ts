import { type DictionaryType } from './common';

export interface IDictionatyFilterExplosviveObject {
    typeId?: string;
    classItemId?: string;
}

export interface IDictionatyFilter {
    type?: DictionaryType;
    explosiveObject?: IDictionatyFilterExplosviveObject;
}
