import { makeAutoObservable } from 'mobx';

import { MODALS } from '~/constants';
import { Modal } from '~/services';
import { stores } from '~/stores';
import { type IDictionatyFilterExplosviveObject, type IOption } from '~/types';

export interface IExplosiveObjectModel {
    openTypeSelect(): void;
    openClassificationSelect(): void;
    setFilters(filters?: IDictionatyFilterExplosviveObject): void;
    filters: IDictionatyFilterExplosviveObject;
    type?: IOption<string>;
    classItem?: IOption<string>;
    removeType: () => void;
    removeClassItem: () => void;
    clear: () => void;
}

export class ExplosiveObjectModel implements IExplosiveObjectModel {
    filters: IDictionatyFilterExplosviveObject = {
        typeId: undefined,
        classItemId: undefined,
    };

    constructor() {
        makeAutoObservable(this);
    }

    clear() {
        this.filters = {
            typeId: undefined,
            classItemId: undefined,
        };
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

    get classItem() {
        const classItem = stores.explosiveObject.classItem.collection.get(this.filters.classItemId);

        return classItem
            ? {
                  value: classItem.id,
                  title: classItem.displayName,
              }
            : undefined;
    }

    removeType() {
        this.setFilters({ typeId: undefined, classItemId: undefined });
    }

    removeClassItem() {
        this.setFilters({ classItemId: undefined });
    }

    setFilters(filters?: Partial<IDictionatyFilterExplosviveObject>) {
        filters && Object.assign(this.filters, filters);
    }

    openTypeSelect() {
        const onSelect = (option: IOption<string>) => {
            this.setFilters({
                typeId: option.value,
                classItemId: this.filters.typeId === option.value ? this.filters.classItemId : undefined,
            });
        };

        Modal.show(MODALS.SELECT, {
            value: this.filters.typeId,
            options: this.typeOptions,
            onSelect,
        });
    }

    openClassificationSelect() {
        const onSelect = (classItemId: string) => {
            this.setFilters({ classItemId });
        };

        Modal.show(MODALS.EXPLOSIVE_OBJECT_CLASSIFICATION, {
            typeId: this.filters.typeId,
            classItemId: this.filters.classItemId,
            onSelect,
        });
    }
}
