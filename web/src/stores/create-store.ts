import { env } from './env';
import { RootStore } from './stores';

/**
 * Setup the root state.
 */
export function createStore(initialState = {}) {
    const store = RootStore.create(initialState, env);

    return { store };
}
