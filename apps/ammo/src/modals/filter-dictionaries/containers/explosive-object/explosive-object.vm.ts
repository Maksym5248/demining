import { makeAutoObservable } from 'mobx';

import { MODALS } from '~/constants';
import { Modal } from '~/services';
import { type ViewModel } from '~/types';

export interface IExplosiveObjectVM extends ViewModel {
    openSelect(): void;
}

export class ExplosiveObjectVM implements IExplosiveObjectVM {
    constructor() {
        makeAutoObservable(this);
    }

    openSelect() {
        Modal.show(MODALS.SELECT, {
            value: undefined,
        });
    }
}

export const explosiveObjectVM = new ExplosiveObjectVM();
