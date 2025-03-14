import EventEmitter from 'events';

enum EVENTS {
    ON_CHANGE = 'ON_CHANGE',
}

export type IUpdateType = 'forced' | 'optional';

export interface IUpdaterParams {
    title: string;
    text: string;
    onLoad: () => Promise<void>;
}

export interface IUpdaterState extends IUpdaterParams {
    isVisible: boolean;
    type: IUpdateType;
}

const eventEmitter = new EventEmitter();

export const createUpdaterState = (state: IUpdaterState): IUpdaterState => ({
    ...state,
    isVisible: state.isVisible ?? true,
});

export interface IUpdater {
    forced(params: IUpdaterParams): void;
    optional(params: IUpdaterParams): void;
    hide(): void;
    onChange(callBack: (value: IUpdaterState) => void): () => void;
    removeAllListeners(): void;
}

export class UpdaterClass implements IUpdater {
    forced = (params: IUpdaterParams) => this.show({ ...params, type: 'forced', isVisible: true });
    optional = (params: IUpdaterParams) => this.show({ ...params, type: 'optional', isVisible: true });

    private show = (params: IUpdaterState) => {
        const p = createUpdaterState(params);
        eventEmitter.emit(EVENTS.ON_CHANGE, p);
    };

    hide() {
        eventEmitter.emit(EVENTS.ON_CHANGE, null);
    }

    onChange = (callBack: (value: IUpdaterState) => void) => {
        eventEmitter.on(EVENTS.ON_CHANGE, callBack);

        return () => eventEmitter.removeListener(EVENTS.ON_CHANGE, callBack);
    };

    removeAllListeners() {
        eventEmitter.removeAllListeners();
    }
}
