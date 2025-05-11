import { isArray, isObject, type Timestamp } from 'shared-my';
import { type IWhere, dates } from 'shared-my-client';

export const getWhere = (values: IWhere) => {
    const filters: ((item: any) => boolean)[] = [];

    Object.keys(values).forEach(key => {
        const value = values[key];

        if (value?.in && isArray(value.in)) {
            filters.push(item => value.in.includes(item[key]));
        }

        if (value?.['>='] && value['>='] !== undefined) {
            filters.push(item => {
                const itemValue = dates.isServerDate(item[key]) ? dates.fromServerDate(item[key] as Timestamp).valueOf() : item[key];
                const filterValue = dates.isServerDate(value['>='])
                    ? dates.fromServerDate(value['>='] as Timestamp).valueOf()
                    : value['>='];
                return itemValue >= filterValue;
            });
        }

        if (value?.['<='] && value['<='] !== undefined) {
            filters.push(item => {
                const itemValue = dates.isServerDate(item[key]) ? dates.fromServerDate(item[key] as Timestamp).valueOf() : item[key];
                const filterValue = dates.isServerDate(value['<='])
                    ? dates.fromServerDate(value['<='] as Timestamp).valueOf()
                    : value['<='];
                return itemValue <= filterValue;
            });
        }

        if (value?.['!='] && value['!='] !== undefined) {
            filters.push(item => {
                const itemValue = dates.isServerDate(item[key]) ? dates.fromServerDate(item[key] as Timestamp).valueOf() : item[key];
                const filterValue = dates.isServerDate(value['!='])
                    ? dates.fromServerDate(value['!='] as Timestamp).valueOf()
                    : value['!='];
                return itemValue !== filterValue;
            });
        }

        if (!!value && value['array-contains-any']) {
            filters.push(item => value['array-contains-any'].some((v: any) => item[key]?.includes(v)));
        }

        if (!isObject(value) && !isArray(value) && value !== undefined) {
            filters.push(item => {
                const itemValue = dates.isServerDate(item[key]) ? dates.fromServerDate(item[key] as Timestamp).valueOf() : item[key];
                const filterValue = dates.isServerDate(value) ? dates.fromServerDate(value as Timestamp).valueOf() : value;
                return itemValue === filterValue;
            });
        }
    });

    return filters;
};
