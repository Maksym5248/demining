import { makeAutoObservable } from 'mobx';
import { type IExplosiveObjectType } from 'shared-my-client';

import { SCREENS } from '~/constants';
import { Navigation } from '~/services';

export interface IDataItem {
    id: string;
    imageUri?: string;
    name: string;
    displayName: string;
    openItem(): void;
}

export class DataItem implements IDataItem {
    constructor(public data: IExplosiveObjectType) {
        makeAutoObservable(this);
    }

    openItem() {
        Navigation.navigate(SCREENS.EXPLOSIVE_OBJECT_CLASSIFICATION, { typeId: this.id });
    }

    get id() {
        return this.data.id;
    }

    get imageUri() {
        return this.data.data.imageUri;
    }

    get displayName() {
        return this.data.displayName;
    }

    get name() {
        return this.data.data.name;
    }
}
