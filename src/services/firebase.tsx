import firebase from "firebase/app";

import { FIREBASE_CONFIG } from "~/config";

class FireBaseClass {
	init() {
		firebase.initializeApp(FIREBASE_CONFIG);
	}
}

export const FireBase = new FireBaseClass();
