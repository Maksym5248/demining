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
    screen?: SCREENS;
}

const categories: IDictionary[] = [
    {
        id: '1',
        type: DictionaryType.Explosive,
        svg: 'explosive',
        screen: SCREENS.SEARCH,
    },
    {
        id: '2',
        type: DictionaryType.ExplosiveObject,
        svg: 'explosive-object',
        screen: SCREENS.EXPLOSIVE_OBJECT_TYPE,
    },
    {
        id: '3',
        type: DictionaryType.ExplosiveDevices,
        svg: 'explosive-device',
        screen: SCREENS.SEARCH,
    },
];

export interface IHomeVM extends ViewModel {
    categories: IDictionary[];
    openSearch(): void;
    openCategory(id: string): void;
}

export class HomeVM implements IHomeVM {
    constructor() {
        makeAutoObservable(this);
    }

    openSearch() {
        Navigation.navigate(SCREENS.SEARCH);
    }

    openCategory(id: string) {
        const item = categories.find(category => category.id === id);
        if (!item?.screen) return;
        Navigation.navigate(item?.screen, {
            filters: {
                type: item.type,
            },
        });
    }

    get classes() {
        return stores.explosive.list.asArray;
    }

    get categories() {
        return categories;
    }
}

export const homeVM = new HomeVM();
