import {
	types,
	getParent,
	getEnv,
} from 'mobx-state-tree';

import { AsyncModel } from './create-flow';
import { getRoot } from './get-root';
import { IAsyncActionParams } from '../types';


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
						root: getRoot(self),
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
