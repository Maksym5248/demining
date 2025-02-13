import { makeAutoObservable } from 'mobx';

import { MODALS } from '~/constants';
import { Modal } from '~/services';
import { stores } from '~/stores';
import { type IDictionatyFilterExplosviveObject, type IOption } from '~/types';

export interface IExplosiveObjectModel {
    openSelect(): void;
    setFilters(filters?: IDictionatyFilterExplosviveObject): void;
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

    setFilters(filters?: Partial<IDictionatyFilterExplosviveObject>) {
        filters && Object.assign(this.filters, filters);
    }

    openSelect() {
        const onSelect = (option: IOption<string>) => {
            this.setFilters({ typeId: option.value });
        };

        Modal.show(MODALS.SELECT, {
            value: this.filters.typeId,
            options: this.typeOptions,
            onSelect,
        });
    }
}
