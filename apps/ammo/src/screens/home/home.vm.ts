import { makeAutoObservable } from 'mobx';

import { SCREENS } from '~/constants';
import { type ISvgName } from '~/core';
import { Navigation } from '~/services';
import { stores } from '~/stores';
import { DictionaryType, type ViewModel } from '~/types';

export interface IDictionary {
    id: string;
    type: string;
    svg: ISvgName;
}

const categories: IDictionary[] = [
    {
        id: '1',
        type: DictionaryType.Explosive,
        svg: 'explosive',
    },
    {
        id: '2',
        type: DictionaryType.ExplosiveObject,
        svg: 'explosive-object',
    },
    {
        id: '3',
        type: DictionaryType.ExplosiveDevices,
        svg: 'explosive-device',
    },
];

export interface IHomeVM extends ViewModel {
    categories: IDictionary[];
    openSearch(): void;
}

export class HomeVM implements IHomeVM {
    constructor() {
        makeAutoObservable(this);
    }

    openSearch() {
        Navigation.navigate(SCREENS.SEARCH);
    }

    get classes() {
        return stores.explosive.list.asArray;
    }

    get categories() {
        return categories;
    }
}

export const homeVM = new HomeVM();
