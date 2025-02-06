import isUndefined from 'lodash/isUndefined';

import { type IUpdateValue, type ICreateValue, type ISubscriptionDocument } from '../types';

const createUpdateDTO =
    <T, B>(createFunction: (v: Partial<T>) => ICreateValue<B>) =>
    (value: Partial<T>): IUpdateValue<B> => {
        const createdValues = createFunction(value);
        const keys = Object.keys(createdValues);

        return keys.reduce((acc, key) => {
            const item = createdValues[key as keyof ICreateValue<B>];

            if (!isUndefined(item)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                acc[key] = item;
            }

            return acc;
        }, {});
    };

function sortByType<T extends { id: string }, B>(
    data: ISubscriptionDocument<T>[],
    factory: (v: T) => B,
): { create: B[]; update: B[]; remove: string[] } {
    const create: B[] = [];
    const update: B[] = [];
    const remove: string[] = [];

    data.forEach(value => {
        if (value.type === 'removed') {
            remove.push(value.data.id);
        } else if (value.type === 'added') {
            create.push(factory(value.data));
        } else if (value.type === 'modified') {
            update.push(factory(value.data));
        }
    });

    return { create, update, remove };
}

export const data = {
    createUpdateDTO,
    sortByType,
};
