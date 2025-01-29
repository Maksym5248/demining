import { makeAutoObservable } from 'mobx';

import { type ISvgName } from '~/core';
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

export interface IExplosiveDetailsVM extends ViewModel {
    categories: IDictionary[];
}

export class ExplosiveDetailsVM implements IExplosiveDetailsVM {
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

export const explosiveDetailsVM = new ExplosiveDetailsVM();
