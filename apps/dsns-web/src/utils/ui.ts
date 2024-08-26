import { isArray } from 'lodash';
import { type TreeNode } from 'shared-my-client/common';

interface Option {
    label: string;
    value: string;
}

const append = (options: Option[], newOption: Partial<Option> | Partial<Option>[]) => {
    const arr = isArray(newOption) ? newOption : [newOption];
    const arrFiltered = arr.filter((el) => !!el.value);

    if (!arrFiltered?.length) return options;

    const optionsValue = options.filter((el) => !arrFiltered.find((item) => el.value === item.value));

    return [...arrFiltered, ...optionsValue];
};

interface AntTreeNode {
    title: string;
    value?: string;
    key: string;
    children: AntTreeNode[];
}

export function transformTreeNodeToTreeData<T>(treeNode: TreeNode<T>, getLabel: (value?: T) => string): AntTreeNode {
    return {
        value: treeNode.id,
        key: treeNode.id,
        title: getLabel(treeNode?.item),
        children: treeNode.children.map((el) => transformTreeNodeToTreeData(el, getLabel)),
    };
}

export function transformTreeNodesToTreeData<T>(treeNodes: TreeNode<T>[], getLabel: (value?: T) => string): AntTreeNode[] {
    return treeNodes.map((el) => transformTreeNodeToTreeData(el, getLabel));
}

export const select = {
    append,
};
