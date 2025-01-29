import { makeAutoObservable } from 'mobx';
import {
    DebounceModel,
    type IDebounceModel,
    type IExplosive,
    type IExplosiveDevice,
    type IExplosiveObject,
    type IOrderModel,
    type ISearchModel,
    OrderModel,
    SearchModel,
} from 'shared-my-client';

import { type ISvgName } from '~/core';
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
    svg: ISvgName;
}

export type Item = IExplosive | IExplosiveObject | IExplosiveDevice;

export interface ISearchVM extends ViewModel {
    setSearchBy(value: string): void;
    searchBy: string;
    asArray: Item[];
    isLoading: boolean;
}

export class SearchVM implements ISearchVM {
    search: ISearchModel<Item>;
    order: IOrderModel<Item>;
    debounce: IDebounceModel = new DebounceModel();

    value = '';

    constructor() {
        this.search = new SearchModel(this.merged, {
            fields: ['displayName'],
        });

        this.order = new OrderModel(this.search.asArray, {
            orderField: 'displayName',
        });

        makeAutoObservable(this);
    }

    unmount() {
        this.search.clear();
        this.debounce.clear();
    }

    setSearchBy(value: string) {
        this.value = value;

        this.debounce.run(() => {
            this.search.setSearchBy(value);
        });
    }

    get searchBy() {
        return this.value;
    }

    get merged() {
        return [...stores.explosive.list.asArray, ...stores.explosiveObject.list.asArray, ...stores.explosiveDevice.list.asArray];
    }

    get asArray() {
        return this.order.asArray;
    }

    get isLoading() {
        return this.debounce.isLoading;
    }
}

export const searchVM = new SearchVM();
