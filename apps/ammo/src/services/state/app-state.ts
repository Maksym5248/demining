import EventEmitter from 'events';

import { AppState as A, type AppStateStatus, type NativeEventSubscription } from 'react-native';

const eventEmitter = new EventEmitter();

enum EVENTS {
    ON_CHANGE = 'ON_CHANGE',
}

export class AppStateClass {
    listener: NativeEventSubscription | null = null;
    isIgnoreUpdates: boolean;

    constructor() {
        this.isIgnoreUpdates = false;
    }

    init() {
        this.listener = A.addEventListener('change', (state: AppStateStatus): void => {
            if (!this.isIgnoreUpdates) {
                eventEmitter.emit(EVENTS.ON_CHANGE, state);
            }
        });
    }
    setIgnoreUpdates(value: boolean) {
        this.isIgnoreUpdates = value;
    }

    onChange = (callBack: (value: AppStateStatus) => void) => {
        eventEmitter.on(EVENTS.ON_CHANGE, callBack);
        return () => eventEmitter.removeListener(EVENTS.ON_CHANGE, callBack);
    };

    removeAllListeners() {
        if (this.listener) {
            this.listener.remove();
        }
        eventEmitter.removeAllListeners();
    }
}
