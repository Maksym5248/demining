import { type EXPLOSIVE_DEVICE_TYPE } from 'shared-my';

import { type DictionaryType } from './common';

export interface IDictionatyFilterExplosviveObject {
    typeId?: string;
    classItemId?: string;
}

export interface IDictionatyFilterExplosviveDevice {
    type?: EXPLOSIVE_DEVICE_TYPE;
}

export interface IDictionatyFilter {
    type?: DictionaryType;
    explosiveObject?: IDictionatyFilterExplosviveObject;
    explosiveDevice?: IDictionatyFilterExplosviveDevice;
}
