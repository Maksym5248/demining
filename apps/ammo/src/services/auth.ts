import { getApp } from '@react-native-firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInAnonymously } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { type IAuthUser, type IAuth } from 'shared-my-client';

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
        await this.auth.createUserWithEmailAndPassword(email, password);
    }

    async signInWithEmailAndPassword(email: string, password: string) {
        await this.auth.signInWithEmailAndPassword(email, password);
    }

    async signInWithGoogle() {
        GoogleSignin.configure({
            // @ts-ignore: clientId is present in options but not specified in firebase type
            iosClientId: authApp.options.clientId,
        });

        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        const signInResult = await GoogleSignin.signIn();

        if (!signInResult.data?.idToken) {
            throw new Error('No ID token found');
        }

        const googleCredential = GoogleAuthProvider.credential(signInResult.data.idToken);

        await this.auth.signInWithCredential(googleCredential);
    }

    async signOut() {
        await this.auth.signOut();
    }

    onAuthStateChanged(fn: (user: IAuthUser | null) => void) {
        onAuthStateChanged(this.auth, fn);
    }
}
