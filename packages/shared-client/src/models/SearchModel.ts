import { isArray } from 'lodash';
import { filterByItemFields } from 'shared-my';

import { type Path, type ISearchParams } from '~/common';

export interface ISearchModel<T extends { data: B }, B extends { id: string }> {
    fields: Path<T>[];
    searchBy: string;
    asArray: T[];
    setSearchFields(fields: Path<T> | Path<T>[]): void;
    setSearchBy(value: string): void;
}

export class SearchModel<T extends { data: B }, B extends { id: string }> implements ISearchModel<T, B> {
    fields: Path<T>[] = [] as Path<T>[];
    searchBy = '';

    constructor(
        private arr: T[],
        private params?: ISearchParams<T>,
    ) {
        this.fields = params?.fields || ([] as Path<T>[]);
        this.searchBy = params?.searchBy || '';
    }

    get asArray() {
        return filterByItemFields<T>(this.searchBy, this.fields, this.arr, this.params?.minSearchLength);
    }

    setSearchFields(fields: Path<T> | Path<T>[]) {
        this.fields = isArray(fields) ? fields : [fields];
    }

    setSearchBy(value: string) {
        this.searchBy = value;
    }
}
