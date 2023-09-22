import { getRoot as MSTgetRoot, IAnyStateTreeNode } from 'mobx-state-tree';

// eslint-disable-next-line import/no-cycle
import { IRootStore } from '../stores/root-store';

export const getRoot = (target: IAnyStateTreeNode) => MSTgetRoot(target) as IRootStore;
