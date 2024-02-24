import { getApp } from "firebase/app";
import { 
	getAuth, 
	onAuthStateChanged,
	NextOrObserver,
	User,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from "firebase/auth";

class AuthClass {
	googleProvide = new GoogleAuthProvider();

	private get auth(){
		return getAuth(getApp())
	}

	onAuthStateChanged(fn:NextOrObserver<User>) {
		onAuthStateChanged(this.auth, fn);
	}

	async signInWithGoogle(){
		await signInWithPopup(this.auth, this.googleProvide)
	}

	async signOut(){
		await signOut(this.auth);
	}
}

export const Auth = new AuthClass();
