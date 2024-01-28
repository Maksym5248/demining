import { getApp } from "firebase/app";
import { signInAnonymously, getAuth,  } from "firebase/auth";

class AuthClass {
	private get auth(){
		return getAuth(getApp())
	}

	signInAnonymously() {
		return signInAnonymously(this.auth)
	}
}

export const Auth = new AuthClass();
