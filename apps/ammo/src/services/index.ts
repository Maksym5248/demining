import { Logger, Modal as ModalClass } from 'shared-my-client';

export type { IMessageState } from './ui/message';
export { Logger } from 'shared-my-client';

import { AnalyticsClass } from './analytics';
import { AssetStorageClass } from './asset-storage';
import { CrashlyticsClass } from './crashlytics';
import { NetInfoClass } from './state';
import { AppStateClass } from './state/app-state';
import { MessageClass } from './ui/message';
import { NavigationClass } from './ui/navigation';

export const Navigation = new NavigationClass();
export const Message = new MessageClass();
export const Crashlytics = new CrashlyticsClass(Logger);
export const Analytics = new AnalyticsClass(Logger, Crashlytics);
export const Modal = new ModalClass(Analytics);
export const AssetStorage = new AssetStorageClass();
export const AppState = new AppStateClass();
export const NetInfo = new NetInfoClass();
