import { types, Instance } from 'mobx-state-tree';
import { message } from 'antd';

import { Auth } from "~/services";

import { asyncAction } from '../../utils';

const Store = types.model('AuthStore');

const signInWithGoogle = asyncAction<Instance<typeof Store>>(() => async ({ flow }) => {
	try {
		flow.start();

		await Auth.signInWithGoogle()

		flow.success();
	} catch (e) {
		message.error("Не вдалось увійти, спробуйте ще раз")
		flow.failed(e as Error);
	}
});

const signInOut = asyncAction<Instance<typeof Store>>(() => async ({ flow }) => {
	try {
		flow.start();

		await Auth.signOut();

		flow.success();
	} catch (e) {
		message.error("Не вдалось вийти, спробуйте ще раз")
		flow.failed(e as Error, true);
	}
});

const signUpWithEmail = asyncAction<Instance<typeof Store>>((email:string, password: string) => async ({ flow }) => {
	try {
		flow.start();

		await Auth.createUserWithEmailAndPassword(email, password);

		flow.success();
	} catch (e) {
		message.error("Не вдалось вийти, спробуйте ще раз")
		flow.failed(e as Error);
	}
});

export const AuthStore = Store.props({
	signInWithGoogle,
	signInOut,
	signUpWithEmail
});
