export const CONFIG = {
	IS_DEV: process.env.ENV === "dev",
	DB_NAME: process.env.DB_NAME as string,
	GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY  as string,
	SENTRY: process.env.SENTRY as string,
};

export const FIREBASE_CONFIG = {
	apiKey: "AIzaSyCq2AhvjA2Uk1T9BEuMcqaA6-dnz370a2A",
	authDomain: "dsns-56583.firebaseapp.com",
	projectId: "dsns-56583",
	storageBucket: "dsns-56583.appspot.com",
	messagingSenderId: "266852481745",
	appId: "1:266852481745:web:07da677f57c1794d9863f0",
	measurementId: "G-XLKE1YZ5H1"
};