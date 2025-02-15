import { path } from './object';
import { filterByStringSearch } from './string';

export const filterByItemFields = <T>(searchBy: string, searchFields: string[], items: T[], minSearchLength = 1) => {
    if (searchBy.length < minSearchLength) {
        return items;
    }

    return items.filter(item =>
        searchFields.reduce((acc, field) => {
            const value = path(item as Record<string, unknown>, field) as string;

            return acc || filterByStringSearch(searchBy, value);
        }, false),
    );
};
