import EventEmitter from 'events';

import { type IAlert, type IAlertParams } from 'shared-my-client';

enum EVENTS {
    ON_CHANGE = 'ON_CHANGE',
}

const eventEmitter = new EventEmitter();

export class AlertClass implements IAlert {
    show = (params: IAlertParams) => {
        eventEmitter.emit(EVENTS.ON_CHANGE, params);
    };

    hide() {
        eventEmitter.emit(EVENTS.ON_CHANGE, undefined);
    }

    onChange = (callBack: (value: IAlertParams) => void) => {
        eventEmitter.on(EVENTS.ON_CHANGE, callBack);

        return () => eventEmitter.removeListener(EVENTS.ON_CHANGE, callBack);
    };

    removeAllListeners() {
        eventEmitter.removeAllListeners();
    }
}
