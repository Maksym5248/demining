import EventEmitter from 'events';

import { type IMessageParams, type IMessage } from 'shared-my-client';

enum EVENTS {
    ON_CHANGE = 'ON_CHANGE',
}

export interface IMessageState {
    text: string;
    params: IMessageParams;
    isVisible: boolean;
}

const eventEmitter = new EventEmitter();

const createParams = (params: IMessageParams = {}): IMessageParams => ({
    delay: params?.delay ?? 0,
    time: params?.time ?? 3000,
});

export const createMessageState = (text: string, isVisible: boolean, params: IMessageParams): IMessageState => ({
    text,
    isVisible,
    params: createParams(params),
});

export class MessageClass implements IMessage {
    error = (text: string, params?: IMessageParams) => this.show(text, params);
    success = (text: string, params?: IMessageParams) => this.show(text, params);
    info = (text: string, params?: IMessageParams) => this.show(text, params);

    private show = (text: string, params: IMessageParams = {}) => {
        const p = createMessageState(text, true, params);
        eventEmitter.emit(EVENTS.ON_CHANGE, text, p);
    };

    hide() {
        const data = createParams();
        eventEmitter.emit(EVENTS.ON_CHANGE, Object.assign(data));
    }

    onChange = (callBack: (value: IMessageState) => void) => {
        eventEmitter.on(EVENTS.ON_CHANGE, callBack);

        return () => eventEmitter.removeListener(EVENTS.ON_CHANGE, callBack);
    };

    removeAllListeners() {
        eventEmitter.removeAllListeners();
    }
}
