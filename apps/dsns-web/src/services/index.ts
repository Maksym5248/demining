import { Logger, Modal as ModalClass } from 'shared-my-client';

export { Logger } from 'shared-my-client';

import { AnalyticsClass } from './analytics';
import { AssetStorageClass } from './asset-storage';
import { AuthClass } from './auth';
import { CrashlyticsClass } from './crashlytics';
import { FuncClass } from './func';
import { ImageClass } from './image';
import { MessageService } from './message';
import { StorageClass } from './storage';
import { TemplateClass } from './template';

export const Auth = new AuthClass();
export const Storage = new StorageClass();
export const SessionStorage = new StorageClass(sessionStorage);
export const Template = new TemplateClass();
export const SecureStorage = new StorageClass();
export const AssetStorage = new AssetStorageClass();
export const Image = new ImageClass();
export const Message = new MessageService();
export const Crashlytics = new CrashlyticsClass(Logger);
export const Analytics = new AnalyticsClass(Logger, Crashlytics);
export const Modal = new ModalClass(Analytics);
export const Func = new FuncClass();
