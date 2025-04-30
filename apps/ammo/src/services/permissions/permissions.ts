import EventEmitter from 'events';

import _ from 'lodash';
import { Alert } from 'react-native';
import P, { checkNotifications, type NotificationSettings, type PermissionStatus } from 'react-native-permissions';
import { isArray } from 'shared-my';
import { Logger } from 'shared-my-client';

import { PERMISSIONS, PERMISSION_STATUS } from '~/constants';
import { t } from '~/localization';
import { type IListPermissions } from '~/types';
import { isString } from '~/utils';

const eventEmitter = new EventEmitter();

export interface IPermissions {
    init: () => Promise<void>;
    onChange: (name: PERMISSIONS, callBack: (value: PermissionStatus) => void) => () => void;
    removeAllListeners: () => void;
    ask: (permission: PERMISSIONS) => Promise<boolean>;
    getStatus: (permission: PERMISSIONS) => PermissionStatus | undefined;
    openSettings: () => void;
    checkAllStatuses: () => Promise<void>;
}
export class PermissionsClass implements IPermissions {
    private permissions: Record<PERMISSIONS, PermissionStatus | undefined>;
    private notificationSettings: NotificationSettings | null;

    constructor(private list: IListPermissions) {
        this.permissions = {
            [PERMISSIONS.PHOTO_LIBRARY]: undefined,
            [PERMISSIONS.NOTIFICATIONS]: undefined,
            [PERMISSIONS.TRACKING_TRANSPARENCY]: undefined,
        };

        this.notificationSettings = null;
    }

    private _setPermission(name: PERMISSIONS, value: PermissionStatus | undefined) {
        if (this.permissions[name] === value) {
            return;
        }

        eventEmitter.emit(name, value);
        this.permissions[name] = value;
    }

    private _setNotificationPermission(value: PermissionStatus, settings: NotificationSettings) {
        this._setPermission(PERMISSIONS.NOTIFICATIONS, value);
        this.notificationSettings = settings;
    }

    private _onUnAvailable = () => {
        Alert.alert(t('permissions.titleUnavailable'), t('permissions.textUnavailable'), [
            {
                text: t('permissions.ok'),
                onPress: () => null,
            },
        ]);

        return false;
    };

    private _onBlocked = () => {
        Alert.alert(t('permissions.titleOpenSettings'), t('permissions.textOpenSettings'), [
            {
                text: t('permissions.ok'),
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: t('permissions.openSettings'),
                onPress: () => P.openSettings(),
            },
        ]);

        return false;
    };

    private _onRequestSingle = async (permission: PERMISSIONS) => {
        const { title, message, name } = this.list[permission];

        if (!name || !message || !title || !isString(name) || isArray(name)) {
            return;
        }

        const options = {
            title,
            message,
            buttonPositive: t('permissions.ok'),
        };

        const status = await P.request(name, options);

        this._setPermission(permission, status);
    };

    private _onRequestMultiple = async (permission: PERMISSIONS) => {
        const { name } = this.list[permission];

        if (!_.isArray(name)) {
            return;
        }

        const res = await P.requestMultiple(name);

        const status = _.get(res, name[0], PERMISSION_STATUS.DENIED);

        this._setPermission(permission, status);
    };

    private _onRequestNotifications = async () => {
        const res = await P.requestNotifications(['alert', 'sound']);
        this._setPermission(PERMISSIONS.NOTIFICATIONS, res?.status);
    };

    private _onRequest = async (permission: PERMISSIONS) => {
        try {
            if (permission === PERMISSIONS.NOTIFICATIONS) {
                await this._onRequestNotifications();
            } else if (_.isArray(_.get(this.list, [permission, 'name']))) {
                await this._onRequestMultiple(permission);
            } else {
                await this._onRequestSingle(permission);
            }
        } catch (error) {
            Logger.error('Permission._onRequest: ', (error as Error)?.message);
        }
    };

    private _updateSingleStatus = async (permission: PERMISSIONS) => {
        const { name } = this.list[permission];

        if (!name) {
            this._setPermission(permission, PERMISSION_STATUS.GRANTED);
            return;
        } else if (!_.isString(name)) {
            return;
        }

        const status = await P.check(name);
        this._setPermission(permission, status);
    };

    private _updateMultipleStatus = async (permission: PERMISSIONS) => {
        const { name } = this.list[permission];

        if (!_.isArray(name)) {
            return;
        }

        const res = await P.checkMultiple(name);
        const status = _.get(res, name[0], PERMISSION_STATUS.DENIED);
        this._setPermission(permission, status);
    };

    private _updateNotificationStatus = async () => {
        const notifications = await checkNotifications();
        this._setNotificationPermission(notifications.status, notifications.settings);
    };

    async checkAllStatuses() {
        const keys = Object.keys(this.list) as Array<PERMISSIONS>;

        await Promise.all(
            keys.map(async permission => {
                await this.updateStatus(permission);
            }),
        );
    }

    updateStatus = async (permission: PERMISSIONS) => {
        try {
            if (permission === PERMISSIONS.NOTIFICATIONS) {
                await this._updateNotificationStatus();
            } else if (_.isArray(_.get(this.list, [permission, 'name']))) {
                await this._updateMultipleStatus(permission);
            } else {
                await this._updateSingleStatus(permission);
            }
        } catch (error) {
            Logger.error('Permission._updateStatus: ', error);
        }
    };

    async init() {
        await this.checkAllStatuses();
    }

    onChange = (name: PERMISSIONS, callBack: (value: PermissionStatus) => void) => {
        eventEmitter.on(name, callBack);

        return () => eventEmitter.removeListener(name, callBack);
    };

    removeAllListeners() {
        eventEmitter.removeAllListeners();
    }

    getStatus = (permission: PERMISSIONS) => this.permissions[permission];

    ask = async (permission: PERMISSIONS) => {
        const status = this.getStatus(permission);
        Logger.log('PERMISSION ASK: ', permission, ' - ', status);

        switch (status) {
            case PERMISSION_STATUS.GRANTED:
                return true;
            case PERMISSION_STATUS.DENIED:
                await this._onRequest(permission);
                return this.getStatus(permission) === PERMISSION_STATUS.GRANTED;
            case PERMISSION_STATUS.LIMITED:
                return false;
            case PERMISSION_STATUS.BLOCKED:
                this._onBlocked();
                return false;
            case PERMISSION_STATUS.UNAVAILABLE:
                this._onUnAvailable();
                return false;
            default:
                return false;
        }
    };

    openSettings = () => P.openSettings();
}
