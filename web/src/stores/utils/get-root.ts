import { getRoot as MSTgetRoot, IAnyStateTreeNode } from 'mobx-state-tree';

export const getRoot = (target: IAnyStateTreeNode) => MSTgetRoot(target);
