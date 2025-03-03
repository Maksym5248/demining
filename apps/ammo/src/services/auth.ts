import { getApp } from '@react-native-firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from '@react-native-firebase/auth';
import { type IAuthUser, type IAuth } from 'shared-my-client';

export class AuthClass implements Pick<IAuth, 'signInAnonymously' | 'onAuthStateChanged'> {
    private get auth() {
        return getAuth(getApp());
    }

    async signInAnonymously() {
        await signInAnonymously(this.auth);
    }

    onAuthStateChanged(fn: (user: IAuthUser | null) => void) {
        onAuthStateChanged(this.auth, fn);
    }
}
