import { MMKV } from 'react-native-mmkv';
import { ASSET_TYPE } from 'shared-my';
import { Logger, Modal as ModalClass } from 'shared-my-client';

export type { IMessageState } from './ui/message';
export { Logger } from 'shared-my-client';

import { FILE_SYSTEM, FILE_FORMAT } from '~/constants';

import { AnalyticsClass } from './analytics';
import { AssetStorageClass } from './asset-storage';
import { AuthClass } from './auth';
import { CrashlyticsClass } from './crashlytics';
import { FileSystemClass } from './file-system';
import { NetInfoClass } from './state';
import { AppStateClass } from './state/app-state';
import { MessageClass } from './ui/message';
import { NavigationClass } from './ui/navigation';

export const LocalStorage = new MMKV();
export const Navigation = new NavigationClass();
export const Message = new MessageClass();
export const Crashlytics = new CrashlyticsClass(Logger);
export const Analytics = new AnalyticsClass(Logger, Crashlytics);
export const Modal = new ModalClass(Analytics);
export const AssetStorage = new AssetStorageClass();
export const AppState = new AppStateClass();
export const NetInfo = new NetInfoClass();
export const Auth = new AuthClass();
export const ImageChahe = new FileSystemClass(FILE_SYSTEM.IMAGE_CACHE, FILE_FORMAT.PNG, ASSET_TYPE.IMAGE);
export const BookCache = new FileSystemClass(FILE_SYSTEM.BOOKS_CACHE, FILE_FORMAT.PDF, ASSET_TYPE.BOOK);
