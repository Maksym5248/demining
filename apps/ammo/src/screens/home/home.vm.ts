import { makeAutoObservable } from 'mobx';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

export enum IDictionaryType {
    Explosive = 'explosive',
    ExplosiveObject = 'explosive-object',
    ExplosiveDevices = 'explosive-device',
}

export interface ICategory {
    id: string;
    type: string;
    svg?: string;
}

const categories: ICategory[] = [
    {
        id: '1',
        type: IDictionaryType.Explosive,
    },
    {
        id: '2',
        type: IDictionaryType.ExplosiveObject,
    },
    {
        id: '3',
        type: IDictionaryType.ExplosiveDevices,
    },
];

export interface IHomeVM extends ViewModel {
    categories: ICategory[];
}

export class HomeVM implements IHomeVM {
    constructor() {
        makeAutoObservable(this);
    }

    get classes() {
        return stores.explosive.list.asArray;
    }

    get categories() {
        return categories;
    }
}

export const homeVM = new HomeVM();
