import { message } from 'antd';
import { types, Instance } from 'mobx-state-tree';

import { AuthService } from '~/services';

import { asyncAction } from '../../utils';

const Store = types.model('AuthStore');

const signInWithGoogle = asyncAction<Instance<typeof Store>>(() => async ({ flow, root }) => {
    try {
        flow.start();
        root.viewer.setLoading(true);

        await AuthService.signInWithGoogle();

        flow.success();
    } catch (e) {
        message.error('Не вдалось увійти, спробуйте ще раз');
        flow.failed(e as Error);
    }
});

const signInOut = asyncAction<Instance<typeof Store>>(() => async ({ flow, root }) => {
    try {
        flow.start();
        root.viewer.setLoading(true);

        await AuthService.signOut();

        flow.success();
    } catch (e) {
        message.error('Не вдалось вийти, спробуйте ще раз');
        flow.failed(e as Error, true);
    }
});

const signUpWithEmail = asyncAction<Instance<typeof Store>>((email: string, password: string) => async ({ flow, root }) => {
    try {
        flow.start();
        root.viewer.setLoading(true);

        await AuthService.createUserWithEmailAndPassword(email, password);

        flow.success();
    } catch (e) {
        message.error('Не вдалось вийти, спробуйте ще раз');
        flow.failed(e as Error);
    }
});

const signInWithEmail = asyncAction<Instance<typeof Store>>((email: string, password: string) => async ({ flow, root }) => {
    try {
        flow.start();
        root.viewer.setLoadingUserInfo(true);

        await AuthService.signInWithEmailAndPassword(email, password);

        flow.success();
    } catch (e) {
        message.error('Не вдалось увйти, спробуйте ще раз');
        flow.failed(e as Error, true);
    }
});

export const AuthStore = Store.props({
    signInWithGoogle,
    signInOut,
    signUpWithEmail,
    signInWithEmail,
});
