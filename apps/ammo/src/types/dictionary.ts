import { type DictionaryType } from './common';

export interface IDictionatyFilterExplosviveObject {
    typeId?: string;
    classItemIds: string[];
}

export interface IDictionatyFilter {
    type?: DictionaryType;
    explosiveObject?: IDictionatyFilterExplosviveObject;
}
