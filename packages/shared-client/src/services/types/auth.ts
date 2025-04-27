import { type User } from '@firebase/auth-types';

export type IAuthUser = User;
export interface IAuth {
    uuid: () => string | undefined;
    onAuthStateChanged: (fn: (user: IAuthUser | null) => void) => void;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    createUserWithEmailAndPassword: (email: string, password: string) => Promise<void>;
    signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
    signInAnonymously: () => Promise<void>;
    checkEmailVerification: () => Promise<void>;
}
