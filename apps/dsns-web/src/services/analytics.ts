import { getAnalytics, logEvent, setUserId } from 'firebase/analytics';
import { getApp } from 'firebase/app';
import { type IAnalyticsEventParams, type IAnalytics, type ILogger, type ICrashlytics } from 'shared-my-client';

export class AnalyticsClass implements IAnalytics {
    constructor(
        private logger: ILogger,
        private crashlytics: ICrashlytics,
    ) {}
    init() {
        this.event('INITIALIZATION APP');
    }

    private get analytics() {
        return getAnalytics(getApp());
    }

    page(name: string, params?: IAnalyticsEventParams) {
        logEvent(this.analytics, `PAGE - ${name}`, params);
        this.crashlytics.setTag('PAGE', name);
        this.logger.log(`ANALYTICS - Page: ${name}`);
    }

    modal(name: string, params?: IAnalyticsEventParams) {
        logEvent(this.analytics, `MODAL - ${name}`, params);
        this.crashlytics.setTag('MODAL', name);
        this.logger.log(`ANALYTICS - Modal: ${name}`);
    }

    event(name: string, params?: IAnalyticsEventParams) {
        logEvent(this.analytics, `EVENT - ${name}`, params);
        this.crashlytics.addBreadcrumb({ type: 'event', message: name, data: params });
        this.logger.log(`ANALYTICS - Event: ${name}`);
    }

    setUserId = (uid: string | null) => {
        setUserId(this.analytics, uid);
        this.crashlytics.setUser(uid ? { id: uid } : null);
        this.logger.log(`ANALYTICS: User ID: ${uid}`);
    };
}
