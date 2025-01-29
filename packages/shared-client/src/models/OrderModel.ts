import { makeAutoObservable } from 'mobx';
import { isFunction, isString, path } from 'shared-my';

import { type Path, OrderBy } from '~/common';

import { type IListModel } from './ListModel';

interface IOrderSection<T> {
    key: string;
    compare: (item: T) => boolean;
    pinBottom?: (item: T, pinItem: T) => boolean;
    sort?: ((orderField: string, orderBy: OrderBy, a: T, b: T) => number) | boolean;
}

export interface IOrderModelParams<T> {
    orderField: Path<T>;
    orderBy?: OrderBy;
    sections?: IOrderSection<T>[];
    isMerged?: boolean;
}

export interface IOrderModel<T> {
    orderField: Path<T> | undefined;
    orderBy: OrderBy;
    setOrder: (field: Path<T>, orderBy: OrderBy) => void;
    toggleOrder: (field: Path<T>) => void;
    resetOrder: () => void;
    asArray: T[];
}

const checkString = (a: string, b: string) => {
    const aV = a?.toLowerCase();
    const bV = b?.toLowerCase();

    if (aV === bV) return 0;
    if (!!aV && !bV) return 1;
    if (!aV && !!bV) return -1;
    return aV < bV ? 1 : -1;
};

const checkNumber = (a: number, b: number) => {
    if (a === b) return 0;
    return a < b ? 1 : -1;
};

const defaultSortFn = function <T>(orderField: Path<T> | undefined, orderBy: OrderBy, a: T, b: T) {
    const valueA = path(a, orderField) ?? '';
    const valueB = path(b, orderField) ?? '';

    const v = isString(valueA) && isString(valueB) ? checkString(valueA, valueB) : checkNumber(valueA as number, valueB as number);

    if (v === 0) return 0;

    return orderBy === OrderBy.Desc ? v : -v;
};

export class OrderModel<T extends { data: B }, B extends { id: string }> implements IOrderModel<T> {
    orderField: Path<T> | undefined;
    orderBy: OrderBy;
    sections: IOrderSection<T>[];
    isMerged?: boolean;

    constructor(
        private list: Pick<IListModel<T, B>, 'asArray'>,
        private params?: IOrderModelParams<T>,
    ) {
        this.orderField = params?.orderField;
        this.orderBy = params?.orderBy ?? OrderBy.Desc;
        this.sections = params?.sections ?? [];
        this.isMerged = params?.isMerged;

        makeAutoObservable(this);
    }

    setOrder = (newOrderField: Path<T> | undefined, newOrderBy: OrderBy) => {
        this.orderField = newOrderField;
        this.orderBy = newOrderBy;
    };

    toggleOrder = (field: Path<T>) => {
        let newOrderBy = this.orderBy;

        if (this.orderField === field) {
            newOrderBy = this.orderBy === OrderBy.Asc ? OrderBy.Desc : OrderBy.Asc;
        }

        this.setOrder(field, newOrderBy);
    };

    resetOrder() {
        this.orderField = this.params?.orderField;
        this.orderBy = this.params?.orderBy ?? OrderBy.Desc;
    }

    private mergeResult(data: IOrderSection<T>[], result: Record<string, T[]>) {
        const mergedSections = [];

        data.forEach(section => {
            const sectionItems = result[section.key];

            if (sectionItems && sectionItems.length) {
                mergedSections.push(...sectionItems);
            }
        }, []);

        mergedSections.push(...result.rest.sort((a, b) => defaultSortFn(this.orderField, this.orderBy, a, b)));
        return mergedSections;
    }

    get asArray() {
        if (!this.orderField) return this.list.asArray;

        const values = this.list.asArray.slice();

        const result: Record<string, T[]> = {
            rest: [],
        };

        values.forEach(item => {
            const section = this.sections?.find(({ compare }) => compare(item));
            const sectionKey = section?.key ?? '';

            if (!sectionKey) {
                result.rest.push(item);
            } else if (result[sectionKey]) {
                result[sectionKey].push(item);
            } else {
                result[sectionKey] = [item];
            }
        });

        this.sections?.forEach(section => {
            const sectionItems = result[section.key];
            const sortFn = isFunction(section.sort) ? section.sort : defaultSortFn;

            if (!sectionItems) return;

            if (section.sort !== false && !!sectionItems?.length) {
                sectionItems.sort((a: T, b: T) => sortFn(this.orderField!, this.orderBy, a, b));
            }

            const pinnedIndexes: number[] = [];

            if (section.pinBottom) {
                result[section.key] = sectionItems.reduce((acc, c) => {
                    const pinnedItems = result.rest
                        .filter((pinItem, index) => {
                            const shouldPin = !!section?.pinBottom?.(c, pinItem);
                            pinnedIndexes.push(index);
                            return shouldPin;
                        })
                        .sort((a: T, b: T) => sortFn(this.orderField!, this.orderBy, a, b));

                    return [...acc, c, ...pinnedItems];
                }, [] as T[]);
            }

            if (pinnedIndexes.length) {
                result.rest = result.rest.filter((el, i) => !pinnedIndexes.includes(i));
            }
        });

        return this.mergeResult(this.sections, result);
    }
}
