import { type PERMISSIONS as PERM_LIB } from 'react-native-permissions';

import { type PERMISSIONS } from '~/constants';

type KeysIOS = keyof typeof PERM_LIB.IOS;
type KeysAndroid = keyof typeof PERM_LIB.ANDROID;

// Type representing a single valid iOS permission string
type IPermissionIosName = (typeof PERM_LIB.IOS)[KeysIOS];
// Type representing a single valid Android permission string
type IPermissionAndroidName = (typeof PERM_LIB.ANDROID)[KeysAndroid];

// Combined type representing a single valid permission string for either platform
type IPermissionName = IPermissionIosName | IPermissionAndroidName;

interface IListItemPermission {
    // Use the specific permission name type instead of generic string
    name: IPermissionName[] | IPermissionName | null;
    title: string | null;
    message: string | null;
}

export type IListPermissions = Record<PERMISSIONS, IListItemPermission>;
