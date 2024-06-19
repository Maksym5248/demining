import { type IAuthUser, type IAuth } from '@/shared-client/services';
import { getApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    type NextOrObserver,
    type User,
} from 'firebase/auth';
import { httpsCallable, getFunctions } from 'firebase/functions';

export class AuthClass implements IAuth {
    googleProvide = new GoogleAuthProvider();

    private get auth() {
        return getAuth(getApp());
    }

    private get functions() {
        return getFunctions(getApp());
    }

    uuid() {
        return this.auth.currentUser?.uid;
    }

    onAuthStateChanged(fn: (user: IAuthUser | null) => void) {
        onAuthStateChanged(this.auth, fn as NextOrObserver<User>);
    }

    async signInWithGoogle() {
        await signInWithPopup(this.auth, this.googleProvide);
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

    async refreshToken() {
        const run = httpsCallable(this.functions, 'refreshToken');
        await run();

        return this.auth?.currentUser?.getIdToken(true);
    }
}
