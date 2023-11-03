import { types } from 'mobx-state-tree';
import _ from 'lodash';

import { error } from '~/utils';

const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const integrateDevTools = (err: Error) => {
  if (IS_DEV && process.env.JEST_WORKER_ID === undefined) {

    const { message, stack } = err;
    if (stack) {
      console.error(message, stack);
    } else {
      console.log(`Error:\n${message}`);
    }
  }
};

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
      return _.get(self, 'error.message', null);
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

      integrateDevTools(e);

      self.inProgress = false;

      self.error = error.createError(e);

      if (throwError) {
        throw e;
      }
    },
  }));
