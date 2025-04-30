import { type PermissionStatus } from 'react-native-permissions';

export enum PERMISSIONS {
    PHOTO_LIBRARY = 'photoLibrary',
    NOTIFICATIONS = 'notifications',
    TRACKING_TRANSPARENCY = 'trackingTransparency',
}

export const PERMISSION_STATUS: Record<string, PermissionStatus> = {
    UNAVAILABLE: 'unavailable',
    BLOCKED: 'blocked',
    DENIED: 'denied',
    GRANTED: 'granted',
    LIMITED: 'limited',
} as const;
