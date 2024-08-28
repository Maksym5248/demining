import { Logger as LoggerClass, Modal as ModalClass } from 'shared-my-client/services';

import { AnalyticsClass } from './analytics';
import { CrashlyticsClass } from './crashlytics';
import { NavigationClass } from './navigation';

export const Navigation = new NavigationClass();
export const Logger = new LoggerClass();
export const Crashlytics = new CrashlyticsClass(Logger);
export const Analytics = new AnalyticsClass(Logger, Crashlytics);
export const Modal = new ModalClass(Analytics);
