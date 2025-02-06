import { setTag, captureException, addBreadcrumb, setUser, init, type Breadcrumb } from '@sentry/react-native';
import { type IPrimitive, type ICrashlytics, type ILogger, type ICrashlyticsUser } from 'shared-my-client';

import { CONFIG } from '~/config';

export class CrashlyticsClass implements ICrashlytics {
    constructor(private logger: ILogger) {}

    init() {
        init({
            dsn: CONFIG.SENTRY_DSN,
            environment: CONFIG.ENV,
        });
    }

    error = (message: string, e: any) => {
        this.logger.error(message, e?.message);
        captureException(message, e);
    };

    addBreadcrumb = (breadcrumb: Breadcrumb) => {
        addBreadcrumb(breadcrumb);
    };

    setUser = (user: ICrashlyticsUser | null) => {
        setUser(user);
    };

    setTag = (key: string, value: IPrimitive) => {
        setTag(key, value);
    };
}
