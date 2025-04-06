import { getAnalytics } from '@react-native-firebase/analytics';
import { getApp } from '@react-native-firebase/app';
import { type IAnalyticsEventParams, type IAnalytics, type ILogger, type ICrashlytics } from 'shared-my-client';

export class AnalyticsClass implements IAnalytics {
    uuid: string | null = null;

    constructor(
        private logger: ILogger,
        private crashlytics: ICrashlytics,
    ) {}

    get analitics() {
        return getAnalytics(getApp());
    }

    init() {
        this.analitics.logEvent('INITIALIZATION_APP');
    }

    page(name: string) {
        this.crashlytics.setTag('PAGE', name);
        this.logger.log(`ANALYTICS - Page: ${name}`);
        this.analitics.logScreenView({ screen_name: name });
    }

    modal(name: string) {
        this.crashlytics.setTag('MODAL', name);
        this.logger.log(`ANALYTICS - Modal: ${name}`);
        this.analitics.logScreenView({ screen_name: name });
    }

    event(name: string, params?: IAnalyticsEventParams) {
        this.crashlytics.addBreadcrumb({ type: 'event', message: name, data: params });
        this.logger.log(`ANALYTICS - Event: ${name}`);
        this.analitics.logEvent(name, params);
    }

    setUserId = (uid: string | null | undefined) => {
        if (this.uuid === uid) return;

        this.uuid = uid ?? null;

        this.logger.log(`ANALYTICS: User ID - ${uid}`);
        this.analitics.setUserId(this.uuid);
        this.crashlytics.setUser(uid ? { id: uid } : null);
    };

    setSession = (session: number) => {
        this.logger.log(`ANALYTICS: Session - ${session}`);
        this.analitics.setUserProperty('session', session.toString());
    };

    setLanguage = (language: string) => {
        this.logger.log(`ANALYTICS: Language - ${language}`);
        this.analitics.setUserProperty('language', language);
    };
}
