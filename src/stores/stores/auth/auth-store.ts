import { types, Instance } from 'mobx-state-tree';

import { Auth } from "~/services";

import { asyncAction } from '../../utils';

const Store = types.model('AuthStore');

const signInWithGoogle = asyncAction<Instance<typeof Store>>(() => async ({ flow }) => {
	try {
		flow.start();

		await Auth.signInWithGoogle()

		flow.success();
	} catch (e) {
		flow.failed(e as Error);
	}
});

const signInOut = asyncAction<Instance<typeof Store>>(() => async ({ flow }) => {
	try {
		flow.start();

		await Auth.signOut();

		flow.success();
	} catch (e) {
		flow.failed(e as Error);
	}
});

export const AuthStore = Store.props({
	signInWithGoogle,
	signInOut
});
