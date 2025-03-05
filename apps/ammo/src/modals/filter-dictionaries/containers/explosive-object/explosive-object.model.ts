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
    classItems?: IOption<string>[];
    removeType: () => void;
    removeClassItem: (id: string) => void;
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

    get classItems() {
        const classItems = this.filters.classItemId?.map(el => {
            const classItem = stores.explosiveObject.classItem.collection.get(el);

            return classItem
                ? {
                      value: classItem.id,
                      title: classItem.displayName,
                  }
                : undefined;
        });

        return classItems?.filter(Boolean) as IOption<string>[];
    }

    removeType() {
        this.setFilters({ typeId: undefined, classItemId: undefined });
    }

    removeClassItem(id: string) {
        this.setFilters({ classItemId: this.filters.classItemId?.filter(el => el !== id) });
    }

    setFilters(filters?: Partial<IDictionatyFilterExplosviveObject>) {
        filters && Object.assign(this.filters, filters);
    }

    openTypeSelect() {
        const onSelect = (option: IOption<string>[]) => {
            this.setFilters({
                typeId: option[0]?.value,
                classItemId: this.filters.typeId === option[0]?.value ? this.filters.classItemId : undefined,
            });
        };

        Modal.show(MODALS.SELECT, {
            value: this.filters.typeId,
            options: this.typeOptions,
            onSelect,
        });
    }

    openClassificationSelect() {
        const onSelect = (classItemId: string[]) => {
            this.setFilters({ classItemId });
        };

        Modal.show(MODALS.EXPLOSIVE_OBJECT_CLASSIFICATION, {
            typeId: this.filters.typeId,
            classItemId: this.filters.classItemId,
            isMulti: true,
            onSelect,
        });
    }
}
