import { getApp } from "firebase/app";
import { getAnalytics, logEvent, setUserId } from "firebase/analytics";

import { Logger } from "./logger";
import { Crashlytics } from "./crashlytics";


interface EventParams {
    [key: string]: any;
}

class AnalyticsClass {
	init() {
		this.event("INITIALIZATION APP")
	}

	private get analytics(){
		return getAnalytics(getApp())
	}

	page(name: string, params?: EventParams) {
		logEvent(this.analytics, `PAGE - ${name}`, params);
		Crashlytics.setTag("PAGE", name);
		Logger.log(`ANALYTICS - Page: ${name}`);
	}

	modal(name: string, params?: EventParams) {
		logEvent(this.analytics, `MODAL - ${name}`, params)
		Crashlytics.setTag("MODAL", name);
		Logger.log(`ANALYTICS - Modal: ${name}`);
	}

	event(name: string, params?: EventParams) {
		logEvent(this.analytics, `EVENT - ${name}`, params);
		Crashlytics.addBreadcrumb({type: 'event', message: name, data: params});
		Logger.log(`ANALYTICS - Event: ${name}`);
	}

	setUserId = (uid: string | null) => {
		setUserId(this.analytics, uid);
		Crashlytics.setUser(uid ? {id: uid}: null);
		Logger.log(`ANALYTICS: User ID: ${uid}`);
	};
}

export const Analytics = new AnalyticsClass();
