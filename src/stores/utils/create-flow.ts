import { types } from 'mobx-state-tree';
import get from 'lodash/get';

import { error } from '~/utils';

const ErrorModel = types.model({
	message: '',
	status: types.maybeNull(types.number),
	reason: types.maybeNull(types.string),
});

export const AsyncModel = types
	.model({
		inProgress: false,
		isLoaded: false,
		error: types.optional(types.maybeNull(ErrorModel), null),
		hasEverBeenRan: false,
	})
	.views((self) => ({
		get isError() {
			return Boolean(self.error);
		},

		get errorMessage(): string | null {
			return get(self, 'error.message', null);
		},

		get inProgressAgain() {
			return self.inProgress && self.hasEverBeenRan;
		},

		get canBeRun() {
			return !self.error && !self.inProgress;
		},
	}))
	.actions((self) => ({
		start() {
			self.inProgress = true;
			self.error = null;
		},

		success() {
			if (!self.hasEverBeenRan) {
				self.hasEverBeenRan = true;
			}

			if (!self.isLoaded) {
				self.isLoaded = true;
			}

			self.inProgress = false;
		},

		failed(e: Error, throwError?: boolean) {
			if (!self.hasEverBeenRan) {
				self.hasEverBeenRan = true;
			}

			self.inProgress = false;
			self.error = error.createError(e);

			if (throwError) {
				throw e;
			}
		},
	}));
