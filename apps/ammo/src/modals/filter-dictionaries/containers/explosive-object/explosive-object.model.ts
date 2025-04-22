import { makeAutoObservable } from 'mobx';
import { type EXPLOSIVE_OBJECT_COMPONENT, explosiveObjectComponentData } from 'shared-my';

import { MODALS } from '~/constants';
import { Modal } from '~/services';
import { stores } from '~/stores';
import { type IDictionatyFilterExplosviveObject, type IOption } from '~/types';

export interface IExplosiveObjectModel {
    openTypeSelect(): void;
    openClassificationSelect(): void;
    openCountrySelect(): void;
    openComponentSelect(): void;
    setFilters(filters?: IDictionatyFilterExplosviveObject): void;
    filters: IDictionatyFilterExplosviveObject;
    type?: IOption<string>;
    classItems?: IOption<string>[];
    countries?: IOption<string>[];
    components?: IOption<EXPLOSIVE_OBJECT_COMPONENT>[];
    removeType: () => void;
    removeClassItem: (id: string) => void;
    removeCountry: (id: string) => void;
    removeComponent: (id: EXPLOSIVE_OBJECT_COMPONENT) => void;
    clear: () => void;
}

export class ExplosiveObjectModel implements IExplosiveObjectModel {
    filters: IDictionatyFilterExplosviveObject = {
        typeId: undefined,
        classItemId: undefined,
        component: undefined,
        countryId: undefined,
    };

    constructor() {
        makeAutoObservable(this);
    }

    clear() {
        this.filters = {
            typeId: undefined,
            classItemId: undefined,
            component: undefined,
            countryId: undefined,
        };
    }

    get typeOptions(): IOption<string>[] {
        return stores.explosiveObject.type.list.map(item => ({
            value: item.id,
            title: item.displayName,
        }));
    }

    get componentOptions(): IOption<EXPLOSIVE_OBJECT_COMPONENT>[] {
        return explosiveObjectComponentData.map(item => ({
            value: item.id,
            title: item.name,
        }));
    }

    get countryOptions(): IOption<string>[] {
        return stores.common.collections.countries.asArray.map(item => ({
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

    get countries() {
        return this.countryOptions.filter(el => this.filters.countryId?.includes(el.value));
    }

    get components() {
        return this.componentOptions.filter(el => this.filters.component?.includes(el.value));
    }

    removeType() {
        this.setFilters({ typeId: undefined, classItemId: undefined });
    }

    removeClassItem(id: string) {
        const value = this.filters.classItemId?.filter(el => el !== id);
        this.setFilters({ classItemId: value?.length ? value : undefined });
    }

    removeCountry(id: string) {
        const value = this.filters.countryId?.filter(el => el !== id);
        this.setFilters({ countryId: value?.length ? value : undefined });
    }

    removeComponent(id: EXPLOSIVE_OBJECT_COMPONENT) {
        const value = this.filters.component?.filter(el => el !== id);
        this.setFilters({ component: value?.length ? value : undefined });
    }

    setFilters(filters?: Partial<IDictionatyFilterExplosviveObject>) {
        filters && Object.assign(this.filters, filters);
    }

    openTypeSelect() {
        const onSelect = (option: IOption<EXPLOSIVE_OBJECT_COMPONENT>[]) => {
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

    openComponentSelect() {
        const onSelect = (option: IOption<EXPLOSIVE_OBJECT_COMPONENT>[]) => {
            const value = option.map(el => el.value);
            this.setFilters({
                component: value?.length ? value : undefined,
            });
        };

        Modal.show(MODALS.SELECT, {
            value: this.filters.component,
            options: this.componentOptions,
            isMulti: true,
            onSelect,
        });
    }

    openCountrySelect() {
        const onSelect = (option: IOption<string>[]) => {
            const value = option.map(el => el.value);
            this.setFilters({
                countryId: value.length ? value : undefined,
            });
        };

        Modal.show(MODALS.SELECT, {
            value: this.filters.countryId,
            options: this.countryOptions,
            isMulti: true,
            onSelect,
        });
    }

    openClassificationSelect() {
        const onSelect = (classItemId: string[]) => {
            this.setFilters({ classItemId: classItemId.length ? classItemId : undefined });
        };

        Modal.show(MODALS.EXPLOSIVE_OBJECT_CLASSIFICATION, {
            typeId: this.filters.typeId,
            classItemId: this.filters.classItemId,
            component: this.filters.component,
            isMulti: true,
            onSelect,
        });
    }
}
