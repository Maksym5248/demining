import { getEnv as MSTgetEnv, IAnyStateTreeNode } from 'mobx-state-tree';

import { IEnv } from '../env';

export const getEnv = (target: IAnyStateTreeNode) => MSTgetEnv(target) as IEnv;
