import { makeAutoObservable } from 'mobx';
import { type IExplosive } from 'shared-my-client';

import { stores } from '~/stores';
import { type ViewModel } from '~/types';

export interface IHomeVM extends ViewModel {
    classes: IExplosive[];
}

export class HomeVM implements IHomeVM {
    constructor() {
        makeAutoObservable(this);
    }

    get classes() {
        return stores.explosive.list.asArray;
    }
}

export const homeVM = new HomeVM();
