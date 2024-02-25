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

	async createUserWithEmailAndPassword(email:string, password: string){
		await createUserWithEmailAndPassword(this.auth, email, password);
	}
	
	async signInWithEmailAndPassword(email:string, password: string){
		await signInWithEmailAndPassword(this.auth, email, password);
	}
}

export const Auth = new AuthClass();
