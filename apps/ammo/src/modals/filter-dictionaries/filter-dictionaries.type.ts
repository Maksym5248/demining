import { type IModalView } from 'shared-my-client';

import { DictionaryType, type IDictionatyFilter } from '~/types';

export interface IFilterDictionariesProps extends IModalView {
    params?: IDictionatyFilter;
}

export const sections: DictionaryType[] = [DictionaryType.ExplosiveObject, DictionaryType.Explosive, DictionaryType.ExplosiveDevices];
