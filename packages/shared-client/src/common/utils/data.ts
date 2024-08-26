import isUndefined from 'lodash/isUndefined';

import { type IUpdateValue, type ICreateValue, type TreeNode } from '../types';

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

function buildTreeNodes<T extends { data: { parentId: string | null; id: string } }>(items: T[]): TreeNode<T>[] {
    const itemMap: { [key: string]: TreeNode<T> } = {};
    const roots: TreeNode<T>[] = [];

    try {
        items.forEach((item) => {
            itemMap[item.data.id] = { id: item.data.id, item, children: [] };
        });

        items.forEach((item) => {
            if (item.data.parentId && itemMap[item.data.parentId]) {
                itemMap[item.data.parentId].children.push(itemMap[item.data.id]);
            } else {
                roots.push(itemMap[item.data.id]);
            }
        });
    } catch (error) {
        console.log('error', error);
    }

    return roots;
}

export const data = {
    createUpdateDTO,
    buildTreeNodes,
};
