import EventEmitter from 'events';

import { v4 as uuid } from 'uuid';

enum EVENTS {
    ON_CHANGE = 'ON_CHANGE',
}

export type IUpdateType = 'forced' | 'optional';

export interface IUpdaterParams {
    title: string;
    text: string;
    link?: string;
    onLoad?: () => Promise<void>;
}

export interface IUpdaterState extends IUpdaterParams {
    id: string;
    isVisible: boolean;
    type: IUpdateType;
}

const eventEmitter = new EventEmitter();

export const createUpdaterState = (state: Omit<IUpdaterState, 'id' | 'isVisible'>): IUpdaterState => ({
    ...state,
    id: uuid(),
    isVisible: true,
});

export interface IUpdater {
    forced(params: IUpdaterParams): void;
    optional(params: IUpdaterParams): void;
    hide(id?: string): void;
    onChange(callBack: (value: IUpdaterState[]) => void): () => void;
    removeAllListeners(): void;
}

export class UpdaterClass implements IUpdater {
    state: IUpdaterState[] = [];

    forced = (params: IUpdaterParams) => this.show(createUpdaterState({ ...params, type: 'forced' }));
    optional = (params: IUpdaterParams) => this.show(createUpdaterState({ ...params, type: 'optional' }));

    private show = (state: IUpdaterState) => {
        this.state.push(state);
        eventEmitter.emit(EVENTS.ON_CHANGE, [...this.state]);
    };

    hide(id?: string) {
        if (id) {
            this.state = this.state.filter(item => item.id !== id);
        } else {
            this.state.shift();
        }

        eventEmitter.emit(EVENTS.ON_CHANGE, [...this.state]);
    }

    onChange = (callBack: (value: IUpdaterState[]) => void) => {
        eventEmitter.on(EVENTS.ON_CHANGE, callBack);

        return () => eventEmitter.removeListener(EVENTS.ON_CHANGE, callBack);
    };

    removeAllListeners() {
        eventEmitter.removeAllListeners();
    }
}
