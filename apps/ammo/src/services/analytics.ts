import analytics from '@react-native-firebase/analytics';
import { type IAnalyticsEventParams, type IAnalytics, type ILogger, type ICrashlytics } from 'shared-my-client';

export class AnalyticsClass implements IAnalytics {
    uuid: string | null = null;

    constructor(
        private logger: ILogger,
        private crashlytics: ICrashlytics,
    ) {}

    init() {
        analytics().logEvent('INITIALIZATION_APP');
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

    setUserId = (uid: string | null | undefined) => {
        if (this.uuid === uid) return;

        this.uuid = uid ?? null;

        this.logger.log(`ANALYTICS: User ID - ${uid}`);
        analytics().setUserId(this.uuid);
        this.crashlytics.setUser(uid ? { id: uid } : null);
    };

    setSession = (session: number) => {
        this.logger.log(`ANALYTICS: Session - ${session}`);
        analytics().setUserProperty('session', session.toString());
    };

    setLanguage = (language: string) => {
        this.logger.log(`ANALYTICS: Language - ${language}`);
        analytics().setUserProperty('language', language);
    };
}
