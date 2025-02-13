import { makeAutoObservable } from 'mobx';

import { MODALS } from '~/constants';
import { Modal } from '~/services';
import { stores } from '~/stores';
import { type IDictionatyFilterExplosviveObject, type IOption } from '~/types';

export interface IExplosiveObjectModel {
    openSelect(): void;
    filters: IDictionatyFilterExplosviveObject;
    typeName?: string;
}

export class ExplosiveObjectModel implements IExplosiveObjectModel {
    filters: IDictionatyFilterExplosviveObject = {
        typeId: undefined,
        classItemIds: [],
    };

    constructor() {
        makeAutoObservable(this);
    }

    get typeOptions(): IOption<string>[] {
        return stores.explosiveObject.type.list.map(item => ({
            value: item.id,
            title: item.displayName,
        }));
    }

    get typeName() {
        return stores.explosiveObject.type.collection.get(this.filters.typeId)?.displayName;
    }

    selectType(value: string) {
        this.filters.typeId = value;
    }

    openSelect() {
        const onSelect = (option: IOption<string>) => {
            this.selectType(option.value);
        };
        console.log('typeOptions', this.typeOptions);
        Modal.show(MODALS.SELECT, {
            value: this.filters.typeId,
            options: this.typeOptions,
            onSelect,
        });
    }
}
