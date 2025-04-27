import { getApp } from '@react-native-firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInAnonymously,
    linkWithCredential,
    EmailAuthProvider,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ERROR_MESSAGE } from 'shared-my';
import { type IAuthUser, type IAuth } from 'shared-my-client';

import { Device } from '~/utils';

export class AuthClass implements IAuth {
    private get auth() {
        return getAuth(getApp());
    }

    uuid() {
        return this.auth.currentUser?.uid;
    }

    async signInAnonymously() {
        await signInAnonymously(this.auth);
    }

    async createUserWithEmailAndPassword(email: string, password: string) {
        if (this.auth.currentUser) {
            const credential = EmailAuthProvider.credential(email, password);
            await linkWithCredential(this.auth.currentUser, credential);
        } else {
            await this.auth.createUserWithEmailAndPassword(email, password);
        }
    }

    async signInWithEmailAndPassword(email: string, password: string) {
        await this.auth.signInWithEmailAndPassword(email, password);
    }

    async signInWithGoogle() {
        GoogleSignin.configure({
            iosClientId: getApp().options.clientId,
        });

        if (Device.isAndroid) {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        }

        const signInResult = await GoogleSignin.signIn();
        console.log('signInResult', signInResult);

        if (signInResult.type === 'cancelled') {
            throw new Error(ERROR_MESSAGE.CANCELED);
        }

        if (!signInResult.data?.idToken) {
            throw new Error('No ID token found');
        }

        const credential = GoogleAuthProvider.credential(signInResult.data.idToken);
        await this.auth.signInWithCredential(credential);
    }

    async signOut() {
        await this.auth.signOut();
    }

    onAuthStateChanged(fn: (user: IAuthUser | null) => void) {
        onAuthStateChanged(this.auth, fn);
    }
}
