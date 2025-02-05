import analytics from '@react-native-firebase/analytics';
import { type IAnalyticsEventParams, type IAnalytics, type ILogger, type ICrashlytics } from 'shared-my-client';

export class AnalyticsClass implements IAnalytics {
    constructor(
        private logger: ILogger,
        private crashlytics: ICrashlytics,
    ) {}

    init() {
        this.event('INITIALIZATION APP');
    }

    page(name: string) {
        this.crashlytics.setTag('PAGE', name);
        this.logger.log(`ANALYTICS - Page: ${name}`);
        analytics().logScreenView({ screen_name: name });
    }

    modal(name: string) {
        this.crashlytics.setTag('MODAL', name);
        this.logger.log(`ANALYTICS - Modal: ${name}`);
        analytics().logScreenView({ screen_name: name });
    }

    event(name: string, params?: IAnalyticsEventParams) {
        this.crashlytics.addBreadcrumb({ type: 'event', message: name, data: params });
        this.logger.log(`ANALYTICS - Event: ${name}`);
        analytics().logEvent(name, params);
    }

    setUserId = (uid: string | null) => {
        this.crashlytics.setUser(uid ? { id: uid } : null);
        this.logger.log(`ANALYTICS: User ID: ${uid}`);
        analytics().setUserId(uid);
    };
}
