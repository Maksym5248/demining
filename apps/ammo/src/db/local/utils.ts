import { Timestamp } from '@react-native-firebase/firestore';
import { isNull, isUndefined } from 'lodash';
import { isArray, isObject, path } from 'shared-my';
import { type IQuery, type IWhere, type Path, dates } from 'shared-my-client';

export const getWhere = (rules: IWhere) => {
    const filters: ((item: any) => boolean)[] = [];

    Object.keys(rules).forEach(key => {
        const rule: any = path(rules, key);

        if (rule?.in && isArray(rule.in)) {
            filters.push(item => {
                const field = path(item, key);
                if (isUndefined(field) || isNull(field)) return false;
                return rule.in.includes(field);
            });
        }

        if (rule?.['>='] && !isUndefined(rule['>='])) {
            filters.push(item => {
                const field = path(item, key) as any; // Explicitly cast to `any`
                const filter = rule['>='];

                if (isUndefined(field) || isNull(field)) return false;

                if (dates.isServerDate(field) && dates.isServerDate(filter)) {
                    const itemValue = dates.fromServerDate(field);
                    const filterValue = dates.fromServerDate(filter);

                    return itemValue.valueOf() >= filterValue.valueOf();
                }

                return field >= filter;
            });
        }

        if (rule?.['<='] && !isUndefined(rule['<='])) {
            filters.push(item => {
                const field = path(item, key) as any; // Explicitly cast to `any`
                const filter = rule['<='];

                if (isUndefined(field) || isNull(field)) return false;

                if (dates.isServerDate(field) && dates.isServerDate(filter)) {
                    const itemValue = dates.fromServerDate(field);
                    const filterValue = dates.fromServerDate(filter);

                    return itemValue.valueOf() <= filterValue.valueOf();
                }

                return field <= filter;
            });
        }

        if (rule?.['!='] || isNull(rule?.['!='])) {
            filters.push(item => {
                const field = path(item, key) as any; // Explicitly cast to `any`
                const filter = rule['!='];

                if (isUndefined(field)) return true;
                if (isNull(rule) && !isNull(field)) return true;
                if (isNull(field) || isNull(filter)) {
                    return field !== filter;
                }

                if (dates.isServerDate(field) && dates.isServerDate(filter)) {
                    const itemValue = dates.fromServerDate(field);
                    const filterValue = dates.fromServerDate(filter);

                    return itemValue.valueOf() !== filterValue.valueOf();
                }

                return field !== filter;
            });
        }

        if (!!rule && rule['array-contains-any']) {
            filters.push(item => {
                const field = path(item, key);
                if (!Array.isArray(field)) return false;
                return rule['array-contains-any'].some((v: any) => field.includes(v));
            });
        }

        if (dates.isServerDate(rule)) {
            filters.push(item => {
                const field = path(item, key);

                if (!dates.isServerDate(field)) return false;

                const itemValue = dates.fromServerDate(field);
                const filterValue = dates.fromServerDate(rule);

                return itemValue.valueOf() === filterValue.valueOf();
            });
        }

        if (isNull(rule)) {
            filters.push(item => {
                const field = path(item, key);
                return isNull(field);
            });
        }

        if (!isObject(rule) && !isArray(rule) && !isUndefined(rule) && !isNull(rule)) {
            filters.push(item => {
                const field = path(item, key);

                if (isUndefined(field)) return false;

                return field === rule;
            });
        }
    });

    return filters;
};

export const where = <T>(args: Partial<IQuery>, data: T[]) => {
    const filters = [...(args?.where ? getWhere(args.where) : [])];

    let filteredData = data;

    // Apply filters
    if (filters.length) {
        filteredData = filteredData.filter(item => filters.every(filter => filter(item)));
    }

    return filteredData;
};

export const order = <T>(args: Partial<IQuery>, data: T[]) => {
    // Apply order
    if (args?.order) {
        const { by, type } = args.order;

        data.sort((a, b) => {
            const aValue = path(a, by as Path<T>);
            const bValue = path(b, by as Path<T>);

            let aComparable: any = aValue;
            let bComparable: any = bValue;

            // Check if values are Firestore Timestamps and convert them
            if (dates.isServerDate(aValue)) {
                aComparable = dates.fromServerDate(aValue).valueOf();
            }

            if (dates.isServerDate(bValue)) {
                bComparable = dates.fromServerDate(bValue).valueOf();
            }

            // Perform comparison
            if (aComparable < bComparable) return type === 'asc' ? -1 : 1;
            if (aComparable > bComparable) return type === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return data;
};

export const startAfter = <T>(args: Partial<IQuery>, data: T[]): T[] => {
    const orderByPath = args?.order?.by as Path<T> | undefined;
    const startValue = args?.startAfter;

    if (!orderByPath || startValue === undefined) {
        return data;
    }

    const index = data.findIndex(item => {
        const itemValue = path(item, orderByPath); // Use path utility to get the value

        if (dates.isServerDate(itemValue) && dates.isServerDate(startValue)) {
            return dates.fromServerDate(itemValue).valueOf() === dates.fromServerDate(startValue).valueOf();
        }

        return itemValue === startValue;
    });

    if (index === -1) {
        return [];
    }

    return data.slice(index + 1);
};

export const limit = <T>(args: Partial<IQuery>, data: T[]) => {
    // Apply limit
    if (args?.limit) {
        return data.slice(0, args.limit);
    }

    return data;
};

// Recursively convert Firestore Timestamp-like objects back to Timestamp
export const convertTimestamps = (obj: any): any => {
    if (obj && typeof obj === 'object') {
        if (obj.seconds !== undefined && obj.nanoseconds !== undefined) {
            return new Timestamp(obj.seconds, obj.nanoseconds);
        }
        for (const key in obj) {
            obj[key] = convertTimestamps(obj[key]);
        }
    }

    return obj;
};
