import { makeAutoObservable } from 'mobx';
import { Explosive, ExplosiveObject, type IExplosive, type IExplosiveDevice, type IExplosiveObject } from 'shared-my-client';

import { SCREENS } from '~/constants';
import { Navigation } from '~/services';
import { stores } from '~/stores';
import { DictionaryType } from '~/types';

export type Item = IExplosive | IExplosiveObject | IExplosiveDevice;

export interface ISearchItem {
    id: string;
    data: Item;
    type: DictionaryType;
    typeName?: string;
    classItemsNames: string[];
    openItem(): void;
}

export class SearchItem implements ISearchItem {
    constructor(public data: Item) {
        makeAutoObservable(this);
    }

    openItem() {
        if (this.type === DictionaryType.Explosive) {
            Navigation.navigate(SCREENS.EXPLOSIVE_DETAILS, { id: this.id });
        } else if (this.type === DictionaryType.ExplosiveObject) {
            Navigation.navigate(SCREENS.EXPLOSIVE_OBJECT_DETAILS, { id: this.id });
        } else if (this.type === DictionaryType.ExplosiveDevices) {
            Navigation.navigate(SCREENS.EXPLOSIVE_DEVICE_DETAILS, { id: this.id });
        }
    }

    get id() {
        return this.data.id;
    }

    get type() {
        if (this.data instanceof Explosive) {
            return DictionaryType.Explosive;
        }

        if (this.data instanceof ExplosiveObject) {
            return DictionaryType.ExplosiveObject;
        }

        return DictionaryType.ExplosiveDevices;
    }

    get typeName() {
        if (this.type === DictionaryType.ExplosiveObject) {
            const item = stores.explosiveObject.collection.get(this.id);

            return item?.type?.data.name;
        }

        return undefined;
    }

    get classItemsNames() {
        if (this.type === DictionaryType.ExplosiveObject) {
            const item = stores.explosiveObject.collection.get(this.id);
            return item?.classItemsNames ?? [];
        }

        return [];
    }
}
