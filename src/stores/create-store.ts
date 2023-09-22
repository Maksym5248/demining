import { RootStore } from './stores';
import { env } from './env';

/**
 * Setup the root state.
 */
export function createStore(initialState = {}) {
  const store = RootStore.create(initialState, env);

  return { store };
}
