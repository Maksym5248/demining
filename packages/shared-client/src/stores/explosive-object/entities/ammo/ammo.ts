import { makeAutoObservable } from 'mobx';

import { type IUpdateValue } from '~/common';

import { type IAmmoData } from './ammo.schema';

export interface IAmmo {
    data: IAmmoData;
}

export class Ammo implements IAmmo {
    data: IAmmoData;

    constructor(data: IAmmoData) {
        this.data = data;

        makeAutoObservable(this);
    }

    updateFields(data: IUpdateValue<IAmmoData>) {
        Object.assign(this.data, data);
    }
}
