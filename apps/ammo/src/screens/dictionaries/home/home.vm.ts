import { makeAutoObservable } from 'mobx';
import { BOOK_TYPE } from 'shared-my';

import { SCREENS } from '~/constants';
import { type ISvgName } from '~/core';
import { Navigation } from '~/services';
import { stores } from '~/stores';
import { DictionaryType, type IBookFilter, type IDictionatyFilter, type ViewModel } from '~/types';

export interface IItem {
    id: string;
    svg: ISvgName;
    screen?: SCREENS;
}

const dictionaries: IItem[] = [
    {
        id: DictionaryType.ExplosiveObject,
        svg: 'explosive-object',
        screen: SCREENS.DICTIONARIES,
    },
    {
        id: DictionaryType.Explosive,
        svg: 'explosive',
        screen: SCREENS.DICTIONARIES,
    },
    {
        id: DictionaryType.ExplosiveDevices,
        svg: 'explosive-device',
        screen: SCREENS.DICTIONARIES,
    },
];

export const books: IItem[] = [
    {
        id: BOOK_TYPE.AMMUNITION,
        svg: 'book-ammo',
        screen: SCREENS.BOOKS,
    },
    {
        id: BOOK_TYPE.EXPLOSIVE,
        svg: 'book-explosive',
        screen: SCREENS.BOOKS,
    },
    {
        id: BOOK_TYPE.BLASTING,
        svg: 'book-blasting',
        screen: SCREENS.BOOKS,
    },
    {
        id: BOOK_TYPE.MINING,
        svg: 'book-mining',
        screen: SCREENS.BOOKS,
    },
    {
        id: BOOK_TYPE.DEMINING,
        svg: 'book-demining',
        screen: SCREENS.BOOKS,
    },
    {
        id: BOOK_TYPE.ORDER_MO,
        svg: 'book-order',
        screen: SCREENS.BOOKS,
    },
];

export interface IHomeVM extends ViewModel {
    dictionaries: IItem[];
    rest: IItem[];
    books: IItem[];
    openSearch(): void;
    openDictionary(id: string): void;
    openDictionaryAll(): void;
    openBooksAll(): void;
    openBook(id: string): void;
    openRest(id: string): void;
}

export class HomeVM implements IHomeVM {
    constructor() {
        makeAutoObservable(this);
    }

    openSearch() {
        Navigation.push(SCREENS.DICTIONARIES_ANIMATED, {
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

    openDictionaryAll() {
        Navigation.navigate(SCREENS.DICTIONARIES);
    }

    openBooksAll() {
        Navigation.navigate(SCREENS.BOOKS);
    }

    openBook(id: string) {
        const item = books.find(el => el.id === id);
        if (!item?.screen) return;

        const filters: IBookFilter = {
            type: item.id as BOOK_TYPE,
        };

        Navigation.navigate(item?.screen, { filters });
    }

    openRest(id: string) {
        const item = this.rest.find(el => el.id === id);
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

    get rest(): IItem[] {
        return [];
    }
}

export const homeVM = new HomeVM();
