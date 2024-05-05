import {
	types,
	getParent,
	getEnv,
	IAnyStateTreeNode,
	IAnyComplexType,
} from 'mobx-state-tree';

import { AsyncModel } from './create-flow';
import { getRoot } from './get-root';
import { IFlow } from '../types';

export interface IAsyncActionParams<T> {
	flow: IFlow;
	env: any;
	self: T;
	root: any;
	parent: IAnyStateTreeNode | IAnyComplexType;
}

export function asyncAction<T>(
	action: (...args: any[]) => (value: IAsyncActionParams<T>) => any,
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
				} catch (e) {
					self.failed(e as Error, throwError);
				}
			},
		}))
		.actions((self) => ({
			run: (...args: any[]): Promise<any> => {
				const promise = () =>
					action(...args)({
						// @ts-ignore
						flow: self,
						self: getParent(self) as T,
						parent: getParent(getParent(self)),
						// @ts-ignore
						root: getRoot(self) as IRootStore,
						env: getEnv(getRoot(self)),
					});

				if (auto) {
					return self.auto(promise);
				}

				return promise();
			},
			clearError(){
				self.error = null
			}
		}));

	return types.optional(FlowModel, {});
}
