import { makeAutoObservable } from 'mobx';

import { type IUpdateValue } from '~/common';

import { type IFuseData } from './fuse.schema';

export interface IFuse {
    data: IFuseData;
}

export class Fuse implements IFuse {
    data: IFuseData;

    constructor(data: IFuseData) {
        this.data = data;

        makeAutoObservable(this);
    }

    updateFields(data: IUpdateValue<IFuseData>) {
        Object.assign(this.data, data);
    }
}
