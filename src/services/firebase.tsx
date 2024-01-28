import { initializeApp  } from "firebase/app";

import { FIREBASE_CONFIG } from "~/config";

class FireBaseClass {
	init() {
		initializeApp(FIREBASE_CONFIG);
	}
}

export const FireBase = new FireBaseClass();
