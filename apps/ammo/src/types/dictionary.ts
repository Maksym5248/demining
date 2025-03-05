import { type BOOK_TYPE, type EXPLOSIVE_DEVICE_TYPE } from 'shared-my';

import { type DictionaryType } from './common';

export interface IDictionatyFilterExplosviveObject {
    typeId?: string;
    classItemId?: string[];
}

export interface IDictionatyFilterExplosviveDevice {
    type?: EXPLOSIVE_DEVICE_TYPE;
}

export interface IDictionatyFilter {
    type?: DictionaryType;
    explosiveObject?: IDictionatyFilterExplosviveObject;
    explosiveDevice?: IDictionatyFilterExplosviveDevice;
}

export enum BookLoadedState {
    ALL = 'all',
    LOADED = 'loaded',
    NOT_LOADED = 'not-loaded',
}

export interface IBookFilter {
    type?: BOOK_TYPE;
    loadState?: BookLoadedState;
}
