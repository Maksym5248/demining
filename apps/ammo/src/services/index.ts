import { ASSET_TYPE } from 'shared-my';
import { ErrorManagerClass, Logger, Modal as ModalClass } from 'shared-my-client';

export type { IMessageState } from './ui/message';
export type { IGalleryImage } from './image-picker';

export type { IErrorManager } from 'shared-my-client';
export { Logger } from 'shared-my-client';

import { FILE_SYSTEM, FILE_FORMAT } from '~/constants';

import { AnalyticsClass } from './analytics';
import { AssetStorageClass } from './asset-storage';
import { AuthClass } from './auth';
import { CrashlyticsClass } from './crashlytics';
import { DebuggerClass, type IDebugger } from './debugger';
import { FileSystemClass } from './file-system';
import { ImagePickerClass } from './image-picker';
import { PermissionsClass, listPermissions } from './permissions';
import { NetInfoClass } from './state';
import { AppStateClass } from './state/app-state';
import { StorageClass } from './storage';
import { AlertClass } from './ui/alert';
import { MessageClass } from './ui/message';
import { NavigationClass } from './ui/navigation';
import { UpdaterClass } from './ui/updater';

export const Storage = new StorageClass();
export const Navigation = new NavigationClass();
export const Message = new MessageClass();
export const Permissions = new PermissionsClass(listPermissions);
export const ErrorManager = new ErrorManagerClass(Message, Logger);
export const Alert = new AlertClass();
export const Updater = new UpdaterClass();
export const Crashlytics = new CrashlyticsClass(Logger);
export const Analytics = new AnalyticsClass(Logger, Crashlytics);
export const Modal = new ModalClass(Analytics);
export const AssetStorage = new AssetStorageClass();
export const AppState = new AppStateClass();
export const NetInfo = new NetInfoClass();
export const Auth = new AuthClass();
export const ImagePicker = new ImagePickerClass(Permissions);
export const Debugger: IDebugger = new DebuggerClass(Storage);
export const ImageChahe = new FileSystemClass(FILE_SYSTEM.IMAGE_CACHE, FILE_FORMAT.PNG, ASSET_TYPE.IMAGE);
export const BookCache = new FileSystemClass(FILE_SYSTEM.BOOKS_CACHE, FILE_FORMAT.PDF, ASSET_TYPE.BOOK);
