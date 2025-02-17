import { makeAutoObservable } from 'mobx';

import { SCREENS } from '~/constants';
import { type ISvgName } from '~/core';
import { Navigation } from '~/services';
import { stores } from '~/stores';
import { DictionaryType, type IDictionatyFilter, type ViewModel } from '~/types';

export interface IDictionary {
    id: string;
    type: DictionaryType;
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
        screen: SCREENS.SEARCH,
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
        Navigation.push(SCREENS.SEARCH_ANIMATED, {
            autoFocus: true,
        });
    }

    openCategory(id: string) {
        const item = categories.find(category => category.id === id);
        if (!item?.screen) return;

        const filters: IDictionatyFilter = {
            type: item.type,
        };

        Navigation.navigate(item?.screen, {
            filters,
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
