import isUndefined from 'lodash/isUndefined';

import { type IUpdateValue, type ICreateValue } from '../types';

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

export const data = {
    createUpdateDTO,
};
