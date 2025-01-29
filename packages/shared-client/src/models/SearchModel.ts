import { isArray } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { filterByItemFields } from 'shared-my';

import { type Path, type ISearchParams } from '~/common';

import { type IListModel } from './ListModel';

export interface ISearchModel<T> {
    fields: Path<T>[];
    searchBy: string;
    asArray: T[];
    setSearchFields(fields: Path<T> | Path<T>[]): void;
    setSearchBy(value: string): void;
    clear(): void;
}

export class SearchModel<T extends { data: B }, B extends { id: string }> implements ISearchModel<T> {
    fields: Path<T>[] = [] as Path<T>[];
    searchBy = '';

    constructor(
        private list: Pick<IListModel<T, B>, 'asArray'>,
        private params?: ISearchParams<T>,
    ) {
        this.fields = params?.fields || ([] as Path<T>[]);
        this.searchBy = params?.searchBy || '';

        makeAutoObservable(this);
    }

    setSearchFields(fields: Path<T> | Path<T>[]) {
        this.fields = isArray(fields) ? fields : [fields];
    }

    setSearchBy(value: string) {
        this.searchBy = value;
    }

    get asArray() {
        return filterByItemFields<T>(this.searchBy, this.fields, this.list.asArray, this.params?.minSearchLength);
    }

    clear() {
        this.searchBy = '';
    }
}
