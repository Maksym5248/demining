import { makeAutoObservable } from 'mobx';
import { isObject, path } from 'shared-my';

import { type Path } from '~/common';

import { type IListModel } from './ListModel';

export interface IFilterRules<F, T> {
    key: Path<F>;
    rule: (item: T, value: any) => boolean;
}

export interface IFiltersParams<F, T extends { data: B }, B extends { id: string }> {
    rules?: IFilterRules<F, T>[];
    initialValues?: F;
}

export interface IFiltersModel<F extends object, T> {
    values: F;
    set(values?: Partial<F>): void;
    asArray: T[];
    count: number;
    clear(): void;
}

const getFieldsCount = (values: Record<string, any>, counter: any[] = []) => {
    Object.values(values).forEach(value => {
        if (isObject(value)) {
            getFieldsCount(value, counter);
        } else if (value) {
            counter.push(value);
        }
    });

    return counter.length;
};

export class FiltersModel<F extends object, T extends { data: B }, B extends { id: string }> implements IFiltersModel<F, T> {
    rules: IFilterRules<F, T>[] = [];
    values: F = {} as F;

    constructor(
        private list: Pick<IListModel<T, B>, 'asArray'>,
        private params?: IFiltersParams<F, T, B>,
    ) {
        this.rules = params?.rules ?? [];
        this.values = params?.initialValues ?? ({} as F);

        makeAutoObservable(this);
    }

    get asArray() {
        return this.list.asArray.filter(
            el =>
                !this.rules.some(({ key, rule }) => {
                    const value = path(this.values, key as unknown as Path<F>) as any;

                    if (!value || !rule) return false;

                    return !rule?.(el, value);
                }),
        );
    }

    set(values?: Partial<F>) {
        Object.assign(this.values, values ?? {});
    }

    clear() {
        this.values = this.params?.initialValues ?? ({} as F);
    }

    get count() {
        return getFieldsCount(this.values);
    }
}
