import { isArray } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { filterByItemFields } from 'shared-my';

import { type Path, type ISearchParams } from '~/common';

export interface ISearchModel<T> {
    fields: Path<T>[];
    searchBy: string;
    asArray: T[];
    setSearchFields(fields: Path<T> | Path<T>[]): void;
    setSearchBy(value: string): void;
    clear(): void;
}

export class SearchModel<T> implements ISearchModel<T> {
    fields: Path<T>[] = [] as Path<T>[];
    searchBy = '';
    asArray: T[] = [];

    constructor(
        private arr: T[],
        private params?: ISearchParams<T>,
    ) {
        this.fields = params?.fields || ([] as Path<T>[]);
        this.searchBy = params?.searchBy || '';
        this.asArray = filterByItemFields<T>(this.searchBy, this.fields, this.arr, this.params?.minSearchLength) ?? [];

        makeAutoObservable(this);
    }

    setSearchFields(fields: Path<T> | Path<T>[]) {
        this.fields = isArray(fields) ? fields : [fields];
    }

    setSearchBy(value: string) {
        this.searchBy = value;
    }

    clear() {
        this.searchBy = '';
    }
}
