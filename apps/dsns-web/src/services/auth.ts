import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInAnonymously,
    type NextOrObserver,
    type User,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { type IAuthUser, type IAuth } from 'shared-my-client';

export class AuthClass implements IAuth {
    googleProvider = new GoogleAuthProvider();

    private get auth() {
        return getAuth(getApp());
    }

    private get functions() {
        return getFunctions(getApp());
    }

    init() {
        GoogleSignin.configure({
            webClientId: '',
        });
    }

    currentUser() {
        return this.auth.currentUser as IAuthUser | null;
    }

    email() {
        return this.auth.currentUser?.email ?? undefined;
    }

    uuid() {
        return this.auth.currentUser?.uid;
    }

    onAuthStateChanged(fn: (user: IAuthUser | null) => void) {
        onAuthStateChanged(this.auth, fn as NextOrObserver<User>);
    }

    async sendPasswordResetEmail(email: string) {
        await sendPasswordResetEmail(this.auth, email);
    }

    async signInWithGoogle() {
        await signInWithPopup(this.auth, this.googleProvider);
        return true;
    }

    async signOut() {
        await signOut(this.auth);
    }

    async createUserWithEmailAndPassword(email: string, password: string) {
        await createUserWithEmailAndPassword(this.auth, email, password);
    }

    async signInWithEmailAndPassword(email: string, password: string) {
        await signInWithEmailAndPassword(this.auth, email, password);
    }

    async signInAnonymously() {
        await signInAnonymously(this.auth);
    }

    async checkEmailVerification() {
        if (!this.auth.currentUser) {
            throw new Error('User not found');
        }

        await this.auth.currentUser.reload();

        if (!this.auth.currentUser.emailVerified) {
            throw new Error('Email not verified');
        }
    }
}
