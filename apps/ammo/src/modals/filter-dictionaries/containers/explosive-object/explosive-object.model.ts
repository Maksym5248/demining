import { makeAutoObservable } from 'mobx';

import { MODALS } from '~/constants';
import { Modal } from '~/services';
import { stores } from '~/stores';
import { type IDictionatyFilterExplosviveObject, type IOption } from '~/types';

export interface IExplosiveObjectModel {
    openSelect(): void;
    setFilters(filters?: IDictionatyFilterExplosviveObject): void;
    filters: IDictionatyFilterExplosviveObject;
    type?: IOption<string>;
    removeType: () => void;
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

    get type() {
        const type = stores.explosiveObject.type.collection.get(this.filters.typeId);

        return type
            ? {
                  value: type.id,
                  title: type.displayName,
              }
            : undefined;
    }

    removeType() {
        this.setFilters({ typeId: undefined });
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
