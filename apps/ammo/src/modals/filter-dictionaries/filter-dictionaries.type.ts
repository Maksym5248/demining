import { type IModalView } from 'shared-my-client';

import { DictionaryType, type IDictionatyFilter } from '~/types';

export interface IFilterDictionariesProps extends IModalView {
    filter?: IDictionatyFilter;
    onSelect?: (filter: IDictionatyFilter) => void;
    onClear?: () => void;
}

export const sections: DictionaryType[] = [DictionaryType.ExplosiveObject, DictionaryType.Explosive, DictionaryType.ExplosiveDevices];
