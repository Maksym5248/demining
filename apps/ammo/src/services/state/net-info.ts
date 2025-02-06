import EventEmitter from 'events';

import N, { NetInfoStateType, type NetInfoState } from '@react-native-community/netinfo';
import _ from 'lodash';

import { Logger } from '~/services';
import { type INetInfoState } from '~/types';

const eventEmitter = new EventEmitter();

enum EVENTS {
    ON_CHANGE = 'ON_CHANGE',
}

const TURN_OFF_DELAY_MS = 6000;
const TURN_ON_DELAY_MS = 6000;

const createInfoState = (value: NetInfoState) =>
    _.isObject(value)
        ? {
              ...value,
              isConnected: isConnected(value),
          }
        : value;

const isConnected = (info: INetInfoState) => {
    return info?.type !== NetInfoStateType.none && info?.isConnected;
};

export class NetInfoClass {
    info: INetInfoState;

    netInfoRemoveListener?: () => void;
    timer: any;

    constructor() {
        this.timer = null;
        this.info = {
            type: NetInfoStateType.unknown,
            isConnected: null,
            isInternetReachable: null,
            details: null,
        };
    }

    isConnected() {
        return isConnected(this.info);
    }

    getInfo(): INetInfoState {
        return Object.assign({}, this.info);
    }

    async init() {
        this.netInfoRemoveListener = N.addEventListener((netInfo: INetInfoState) => {
            const delay = isConnected(netInfo) ? TURN_ON_DELAY_MS : TURN_OFF_DELAY_MS;

            if (this.timer) {
                clearTimeout(this.timer);
            }

            this.timer = setTimeout(() => {
                this.setInfo(netInfo);
                eventEmitter.emit(EVENTS.ON_CHANGE, this.getInfo());
            }, delay);
        });
    }

    setInfo(value: INetInfoState) {
        const newValue = createInfoState(value);

        if (isConnected(this.info) !== isConnected(newValue as INetInfoState)) {
            Logger.log('NET_INFO:', newValue?.isConnected ? 'connected' : 'disconnected');
        }

        this.info = newValue as INetInfoState;
    }

    async pingInfo() {
        const info = await N.fetch();

        this.setInfo(info);
        eventEmitter.emit(EVENTS.ON_CHANGE, this.getInfo());
    }

    onChange = (callBack: (value: INetInfoState) => void) => {
        eventEmitter.on(EVENTS.ON_CHANGE, callBack);

        return () => eventEmitter.removeListener(EVENTS.ON_CHANGE, callBack);
    };

    removeAllListeners() {
        if (this.netInfoRemoveListener) {
            this.netInfoRemoveListener();
        }

        clearTimeout(this.timer);
        eventEmitter.removeAllListeners();
    }
}
