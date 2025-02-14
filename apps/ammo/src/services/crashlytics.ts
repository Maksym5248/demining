import { setTag, captureException, addBreadcrumb, setUser, init, type Breadcrumb } from '@sentry/react-native';
import { type IPrimitive, type ICrashlytics, type ILogger, type ICrashlyticsUser } from 'shared-my-client';

import { CONFIG } from '~/config';

export class CrashlyticsClass implements ICrashlytics {
    constructor(private logger: ILogger) {}

    init() {
        !CONFIG.IS_DEBUG &&
            init({
                dsn: CONFIG.SENTRY_DSN,
                environment: CONFIG.ENV,
            });
    }

    error = (message: string, e: any) => {
        this.logger.error(message, e?.message);
        !CONFIG.IS_DEBUG && captureException(message, e);
    };

    addBreadcrumb = (breadcrumb: Breadcrumb) => {
        !CONFIG.IS_DEBUG && addBreadcrumb(breadcrumb);
    };

    setUser = (user: ICrashlyticsUser | null) => {
        !CONFIG.IS_DEBUG && setUser(user);
    };

    setTag = (key: string, value: IPrimitive) => {
        !CONFIG.IS_DEBUG && setTag(key, value);
    };
}
