import { getApp } from "firebase/app";
import { 
	signInAnonymously,
	getAuth, 
	onAuthStateChanged,
	NextOrObserver,
	User, 
} from "firebase/auth";

class AuthClass {
	private get auth(){
		return getAuth(getApp())
	}

	async signInAnonymously() {
		return signInAnonymously(this.auth)
	}

	onAuthStateChanged(fn:NextOrObserver<User>) {
		onAuthStateChanged(this.auth, fn);
	}
}

export const Auth = new AuthClass();
