import EventEmitter from 'events';

import { type IMessageParams, type IMessage } from 'shared-my-client';

enum EVENTS {
    ON_CHANGE = 'ON_CHANGE',
}
export type IMessageType = 'error' | 'success' | 'info';

export interface IMessageState {
    text: string;
    params: IMessageParams;
    isVisible: boolean;
    type: IMessageType;
}

const eventEmitter = new EventEmitter();

const createParams = (params: IMessageParams = {}): IMessageParams => ({
    delay: params?.delay ?? 0,
    time: params?.time ?? 3000,
});

export const createMessageState = (text: string, type: IMessageType, isVisible: boolean, params?: IMessageParams): IMessageState => ({
    text,
    isVisible,
    params: createParams(params),
    type,
});

export class MessageClass implements IMessage {
    error = (text: string, params?: IMessageParams) => this.show(text, 'error', params);
    success = (text: string, params?: IMessageParams) => this.show(text, 'success', params);
    info = (text: string, params?: IMessageParams) => this.show(text, 'info', params);

    private show = (text: string, type: IMessageType, params: IMessageParams = {}) => {
        const p = createMessageState(text, type, true, params);
        eventEmitter.emit(EVENTS.ON_CHANGE, p);
    };

    hide() {
        const p = createMessageState('', 'info', false);
        eventEmitter.emit(EVENTS.ON_CHANGE, p);
    }

    onChange = (callBack: (value: IMessageState) => void) => {
        eventEmitter.on(EVENTS.ON_CHANGE, callBack);

        return () => eventEmitter.removeListener(EVENTS.ON_CHANGE, callBack);
    };

    removeAllListeners() {
        eventEmitter.removeAllListeners();
    }
}
