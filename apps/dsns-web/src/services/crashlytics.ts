import * as Sentry from '@sentry/react';
import { type ICrashlytics, type ILogger } from 'shared-my-client/services';

import { CONFIG } from '~/config';

type Primitive = number | string | boolean | bigint | symbol | null | undefined;

export class CrashlyticsClass implements ICrashlytics {
    constructor(private logger: ILogger) {}
    init() {
        if (!CONFIG.IS_DEBUG) {
            Sentry.init({
                dsn: CONFIG.SENTRY,
                environment: process.env.ENV,
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
    }

    error = (message: string, e: any) => {
        if (!CONFIG.IS_DEBUG) {
            Sentry.captureException(e as Error, {
                extra: { message },
            });
        }

        this.logger.error(e?.message);
    };

    addBreadcrumb = (breadcrumb: Sentry.Breadcrumb) => {
        if (!CONFIG.IS_DEBUG) {
            Sentry.addBreadcrumb(breadcrumb);
        }
    };

    setUser = async (user: Sentry.User | null) => {
        if (!CONFIG.IS_DEBUG) {
            Sentry.setUser(user);
        }
    };

    setTag = async (key: string, value: Primitive) => {
        if (!CONFIG.IS_DEBUG) {
            Sentry.setTag(key, value);
        }
    };
}
