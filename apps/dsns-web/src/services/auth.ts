import { getApp } from 'firebase/app';
import {
    getAuth,
    onAuthStateChanged,
    type NextOrObserver,
    type User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { httpsCallable, getFunctions } from 'firebase/functions';

export interface IAuthService {
    googleProvide: GoogleAuthProvider;
    uuid: () => string | undefined;
    onAuthStateChanged: (fn: NextOrObserver<User>) => void;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    createUserWithEmailAndPassword: (email: string, password: string) => Promise<void>;
    signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
    refreshToken: () => Promise<string | undefined>;
}

class AuthClass implements IAuthService {
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

    onAuthStateChanged(fn: NextOrObserver<User>) {
        onAuthStateChanged(this.auth, fn);
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

export const AuthService = new AuthClass();
