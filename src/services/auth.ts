import { getApp } from "firebase/app";
import { 
	getAuth, 
	onAuthStateChanged,
	NextOrObserver,
	User,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword
} from "firebase/auth";
import { httpsCallable, getFunctions } from "firebase/functions";

class AuthClass {
	googleProvide = new GoogleAuthProvider();

	private get auth(){
		return getAuth(getApp())
	}

	private get functions(){
		return getFunctions(getApp())
	}

	uuid(){
		return this.auth.currentUser?.uid;
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

	async createUserWithEmailAndPassword(email:string, password: string){
		await createUserWithEmailAndPassword(this.auth, email, password);
	}
	
	async signInWithEmailAndPassword(email:string, password: string){
		await signInWithEmailAndPassword(this.auth, email, password);
	}

	async refreshToken(){
		const run = httpsCallable(this.functions, 'refreshToken');
		await run();

		return this.auth?.currentUser?.getIdToken(true);
	}
}

export const Auth = new AuthClass();
