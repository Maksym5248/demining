import {
  types,
  getParent,
  getEnv,
  Instance,
  IAnyStateTreeNode,
  IAnyComplexType,
} from 'mobx-state-tree';

import { AsyncModel } from './create-flow';
import { getRoot } from './get-root';
import { IEnv } from '../env';
import { IRootStore } from '../stores/root-store';

export type IFlow = Instance<typeof AsyncModel>

export interface IAsyncAction<T> {
  flow: Instance<typeof AsyncModel>;
  env: IEnv;
  self: T;
  root: IRootStore;
  parent: IAnyStateTreeNode | IAnyComplexType;
}

export function asyncAction<T>(
  action: (...args: any[]) => (value: IAsyncAction<T>) => any,
  auto?: boolean,
  throwError = true,
) {
  const FlowModel = AsyncModel.named('FlowModel')
    .actions((self) => ({
      async auto(promise: () => Promise<any>) {
        try {
          self.start();

          await promise();

          self.success();
        } catch (err) {
          self.failed(err, throwError);
        }
      },
    }))
    .actions((self) => ({
      run: (...args: any[]): Promise<any> => {
        const promise = () =>
          action(...args)({
            flow: self,
            self: getParent(self) as T,
            parent: getParent(getParent(self)),
            root: getRoot(self) as IRootStore,
            env: getEnv(getRoot(self)),
          });

        if (auto) {
          return self.auto(promise);
        }

        return promise();
      },
    }));

  return types.optional(FlowModel, {});
}
