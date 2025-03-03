import { getApp } from '@react-native-firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from '@react-native-firebase/auth';
import { type IAuthUser, type IAuth } from 'shared-my-client';

export class AuthClass implements Pick<IAuth, 'signInAnonymously' | 'onAuthStateChanged' | 'uuid'> {
    private get auth() {
        return getAuth(getApp());
    }

    uuid() {
        return this.auth.currentUser?.uid;
    }

    async signInAnonymously() {
        await signInAnonymously(this.auth);
    }

    onAuthStateChanged(fn: (user: IAuthUser | null) => void) {
        onAuthStateChanged(this.auth, fn);
    }
}
