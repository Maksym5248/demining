import { makeAutoObservable } from 'mobx';
import { BOOK_TYPE, bookTypesMap } from 'shared-my';

import { SCREENS } from '~/constants';
import { type ISvgName } from '~/core';
import { Navigation } from '~/services';
import { stores } from '~/stores';
import { DictionaryType, type IDictionatyFilter, type ViewModel } from '~/types';

export interface IItem {
    id: string;
    name?: string;
    svg: ISvgName;
    screen?: SCREENS;
}

const dictionaries: IItem[] = [
    {
        id: DictionaryType.ExplosiveObject,
        svg: 'explosive-object',
        screen: SCREENS.SEARCH,
    },
    {
        id: DictionaryType.Explosive,
        svg: 'explosive',
        screen: SCREENS.SEARCH,
    },
    {
        id: DictionaryType.ExplosiveDevices,
        svg: 'explosive-device',
        screen: SCREENS.SEARCH,
    },
];

export const books: IItem[] = [
    {
        id: bookTypesMap[BOOK_TYPE.AMMUNITION].id,
        name: bookTypesMap[BOOK_TYPE.AMMUNITION].name,
        svg: 'book-ammo',
        screen: SCREENS.BOOKS,
    },
    {
        id: bookTypesMap[BOOK_TYPE.EXPLOSIVE].id,
        name: bookTypesMap[BOOK_TYPE.EXPLOSIVE].name,
        svg: 'book-explosive',
        screen: SCREENS.BOOKS,
    },
    {
        id: bookTypesMap[BOOK_TYPE.BLASTING].id,
        name: bookTypesMap[BOOK_TYPE.BLASTING].name,
        svg: 'book-blasting',
        screen: SCREENS.BOOKS,
    },
    {
        id: bookTypesMap[BOOK_TYPE.MINING].id,
        name: bookTypesMap[BOOK_TYPE.MINING].name,
        svg: 'book-mining',
        screen: SCREENS.BOOKS,
    },
    {
        id: bookTypesMap[BOOK_TYPE.DEMINING].id,
        name: bookTypesMap[BOOK_TYPE.DEMINING].name,
        svg: 'book-demining',
        screen: SCREENS.BOOKS,
    },
    {
        id: bookTypesMap[BOOK_TYPE.ORDER_MO].id,
        name: bookTypesMap[BOOK_TYPE.ORDER_MO].name,
        svg: 'book-order',
        screen: SCREENS.BOOKS,
    },
];

export const rest: IItem[] = [
    {
        id: 'settings',
        svg: 'settings',
        screen: SCREENS.SETTINGS,
    },
];

export interface IHomeVM extends ViewModel {
    dictionaries: IItem[];
    rest: IItem[];
    books: IItem[];
    openSearch(): void;
    openDictionary(id: string): void;
    openBook(id: string): void;
    openRest(id: string): void;
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

    openDictionary(id: string) {
        const item = dictionaries.find(category => category.id === id);
        if (!item?.screen) return;

        const filters: IDictionatyFilter = {
            type: item.id as DictionaryType,
        };

        Navigation.navigate(item?.screen, {
            filters,
        });
    }

    openBook(id: string) {
        const item = books.find(el => el.id === id);
        if (!item?.screen) return;
        Navigation.navigate(item?.screen);
    }

    openRest(id: string) {
        const item = rest.find(el => el.id === id);
        if (!item?.screen) return;
        Navigation.navigate(item?.screen);
    }

    get classes() {
        return stores.explosive.list.asArray;
    }

    get dictionaries() {
        return dictionaries;
    }

    get books() {
        return books;
    }

    get rest() {
        return rest;
    }
}

export const homeVM = new HomeVM();
