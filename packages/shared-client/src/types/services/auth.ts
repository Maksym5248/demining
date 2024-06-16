import { type User, type GoogleAuthProvider } from '@firebase/auth-types';

export type IAuthUser = User;
export interface IAuth {
    googleProvide: GoogleAuthProvider;
    uuid: () => string | undefined;
    onAuthStateChanged: (fn: (user: IAuthUser | null) => void) => void;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    createUserWithEmailAndPassword: (email: string, password: string) => Promise<void>;
    signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
    refreshToken: () => Promise<string | undefined>;
}
