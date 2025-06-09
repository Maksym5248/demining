import { getApp } from '@react-native-firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInAnonymously,
    sendEmailVerification,
    onIdTokenChanged,
    sendPasswordResetEmail,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ERROR_MESSAGE } from 'shared-my';
import { type IAuthUser, type IAuth } from 'shared-my-client';

import { CONFIG } from '~/config';
import { Device } from '~/utils';

export class AuthClass implements IAuth {
    private get auth() {
        return getAuth(getApp());
    }

    uuid() {
        return this.auth.currentUser?.uid;
    }

    email() {
        return this.auth.currentUser?.email ?? undefined;
    }

    isAnonymous() {
        return this.auth.currentUser?.isAnonymous;
    }

    isEmailVerified() {
        return !!this.auth.currentUser?.emailVerified;
    }

    currentUser() {
        return this.auth.currentUser as unknown as IAuthUser;
    }

    shouldCheckEmailVerification() {
        return !!this.auth.currentUser && !this.auth.currentUser?.emailVerified && !this.auth.currentUser?.isAnonymous;
    }

    async signInAnonymously() {
        await signInAnonymously(this.auth);
    }

    async checkEmailVerification() {
        if (!this.shouldCheckEmailVerification()) {
            return;
        }

        if (!this.auth.currentUser) {
            throw new Error('User not found');
        }

        await this.auth.currentUser.reload();

        if (!this.auth.currentUser.emailVerified) {
            throw new Error('Email not verified');
        }
    }

    async createUserWithEmailAndPassword(email: string, password: string) {
        await this.auth.createUserWithEmailAndPassword(email, password);

        if (!this.auth.currentUser) {
            throw new Error('User not found');
        }

        await sendEmailVerification(this.auth.currentUser);
    }

    async signInWithEmailAndPassword(email: string, password: string) {
        await this.auth.signInWithEmailAndPassword(email, password);
    }

    async signInWithGoogle() {
        GoogleSignin.configure({
            webClientId: CONFIG.WEB_CLIENT_ID,
            iosClientId: getApp().options.clientId,
        });

        if (Device.isAndroid) {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        }

        const signInResult = await GoogleSignin.signIn();

        if (signInResult.type === 'cancelled') {
            throw new Error(ERROR_MESSAGE.CANCELED);
        }

        if (!signInResult.data?.idToken) {
            throw new Error('No ID token found');
        }

        const credential = GoogleAuthProvider.credential(signInResult.data.idToken);
        const res = await this.auth.signInWithCredential(credential);
        return res.additionalUserInfo?.isNewUser ?? false;
    }

    async sendPasswordResetEmail(email: string): Promise<void> {
        if (!email) {
            throw new Error('Email is required to reset password.');
        }

        await sendPasswordResetEmail(this.auth, email);
    }

    async signOut() {
        await this.auth.signOut();
    }

    onAuthStateChanged(fn: (user: IAuthUser | null) => void) {
        // @ts-expect-error
        onAuthStateChanged(this.auth, fn);
    }

    onIdTokenChanged(fn: (user: IAuthUser | null) => void) {
        // @ts-expect-error
        onIdTokenChanged(this.auth, fn);
    }

    async refreshToken() {
        await this.auth.currentUser?.getIdToken(true);
    }
}
