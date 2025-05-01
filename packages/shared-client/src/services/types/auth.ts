import { type User } from '@firebase/auth-types';

export type IAuthUser = User;
export interface IAuth {
    uuid: () => string | undefined;
    email: () => string | undefined;
    currentUser: () => IAuthUser | null;
    onAuthStateChanged: (fn: (user: IAuthUser | null) => void) => void;
    signInWithGoogle: () => Promise<boolean>;
    signOut: () => Promise<void>;
    createUserWithEmailAndPassword: (email: string, password: string) => Promise<void>;
    signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
    signInAnonymously: () => Promise<void>;
    sendPasswordResetEmail: (email: string) => Promise<void>;
    checkEmailVerification: () => Promise<void>;
}
