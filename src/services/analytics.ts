import firebase from "firebase/app";
import { getAnalytics, logEvent, setUserId } from "firebase/analytics";

import { Logger } from "./logger";
import { Crashlytics } from "./crashlytics";

const analytics = getAnalytics(firebase.getApp())

interface EventParams {
    [key: string]: any;
}

class AnalyticsClass {
	init() {
		this.event("INITIALIZATION APP")
	}

	page(name: string, params?: EventParams) {
		logEvent(analytics, `PAGE - ${name}`, params);
		Crashlytics.setTag("PAGE", name);
		Logger.log(`ANALYTICS - Page: ${name}`);
	}

	modal(name: string, params?: EventParams) {
		logEvent(analytics, `MODAL - ${name}`, params)
		Crashlytics.setTag("MODAL", name);
		Logger.log(`ANALYTICS - Modal: ${name}`);
	}

	event(name: string, params?: EventParams) {
		logEvent(analytics, `EVENT - ${name}`, params);
		Crashlytics.addBreadcrumb({type: 'event', message: name, data: params});
		Logger.log(`ANALYTICS - Event: ${name}`);
	}

	setUserId = (uid: string) => {
		setUserId(analytics, uid);
		Crashlytics.setUser({id: uid});
		Logger.log(`ANALYTICS: User ID: ${uid}`);
	};
}

export const Analytics = new AnalyticsClass();
