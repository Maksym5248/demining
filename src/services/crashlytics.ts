import * as Sentry from "@sentry/react";

import { CONFIG } from "~/config";

import { Logger } from "./logger";

type Primitive = number | string | boolean | bigint | symbol | null | undefined;

class CrashlyticsClass {
	init() {
		Sentry.init({
			dsn: CONFIG.SENTRY,
			integrations: [
			  new Sentry.BrowserTracing(),
			  new Sentry.Replay({
					maskAllText: false,
					blockAllMedia: false,
			  }),
			],
			tracesSampleRate: 1.0, //  Capture 100% of the transactions
			replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
			replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
		  });
	}

	error = (message:string, e: any) => {
		Sentry.captureException(e as Error, {
			extra: { message }
		});
		Logger.error(e?.message);
	};
	  
	addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
		Sentry.addBreadcrumb(breadcrumb);
	};
	  
	setUser = async (user: Sentry.User | null) => {
		Sentry.setUser(user);
	}
	  
	setTag = async (key: string, value: Primitive) => {
		Sentry.setTag(key, value);
	}
}

export const Crashlytics = new CrashlyticsClass();