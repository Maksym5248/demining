import { PERMISSIONS as PERM_LIB } from 'react-native-permissions';

import { PERMISSIONS } from '~/constants';
import { t } from '~/localization';
import { Device } from '~/utils';

import { type IListPermissions } from '../../types';

export const listPermissions: IListPermissions = {
    [PERMISSIONS.PHOTO_LIBRARY]: {
        name: Device.isIOS ? PERM_LIB.IOS.PHOTO_LIBRARY : PERM_LIB.ANDROID.READ_MEDIA_IMAGES,
        title: t('permissions.photoLibaryTitle'),
        message: t('permissions.photoLibaryMessage'),
    },
    [PERMISSIONS.NOTIFICATIONS]: {
        name: Device.isIOS ? PERM_LIB.IOS.APP_TRACKING_TRANSPARENCY : null,
        title: null,
        message: null,
        isDisabled: true,
    },
    [PERMISSIONS.TRACKING_TRANSPARENCY]: {
        name: Device.isIOS ? PERM_LIB.IOS.APP_TRACKING_TRANSPARENCY : null,
        title: null,
        message: null,
    },
};
