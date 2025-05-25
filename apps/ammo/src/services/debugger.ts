import EventEmitter from 'events';

import { STORAGE } from '~/constants';

import { type IStorageExtended } from './storage';

const eventEmitter = new EventEmitter();

enum EVENTS {
    TOGGLE_VISIBLE = 'TOGGLE_VISIBLE',
    TOGGLE_VISIBLE_BUTTON = 'TOGGLE_VISIBLE_BUTTON',
    TOGGLE_ENABLE = 'TOGGLE_ENABLE',
}

export interface IDebugger {
    isVisible: boolean;
    isVisibleButton: boolean;
    isEnabled: boolean;
    init(isEnabled: boolean): void;
    enable(): void;
    disable(): void;
    show(): void;
    hide(): void;
    showButton(): void;
    hideButton(): void;
    onChangeVisible(callBack: (value: boolean) => void): () => void;
    onChangeVisibleButton(callBack: (value: boolean) => void): () => void;
    onChangeEnabled(callBack: (value: boolean) => void): () => void;
    removeAllListeners(): void;
}

export class DebuggerClass implements IDebugger {
    isVisible: boolean = false;
    isVisibleButton: boolean = false;
    isEnabled: boolean = false;

    constructor(private storage: IStorageExtended) {}

    init(isEnabled: boolean) {
        this.isEnabled = isEnabled;

        if (this.isEnabled) {
            this.isVisibleButton = this.storage.getBoolean(STORAGE.DEBUGGER_VISIBLE_BUTTON) ?? false;
            this.enable();
        }

        if (this.isEnabled && this.isVisibleButton) {
            this.showButton();
        }
    }

    enable = () => {
        this.isEnabled = true;
        eventEmitter.emit(EVENTS.TOGGLE_ENABLE, this.isEnabled);
    };

    disable = () => {
        this.isEnabled = false;
        eventEmitter.emit(EVENTS.TOGGLE_ENABLE, this.isEnabled);
    };

    showButton = () => {
        this.isVisibleButton = true;
        eventEmitter.emit(EVENTS.TOGGLE_VISIBLE_BUTTON, this.isVisibleButton);
        this.storage.set(STORAGE.DEBUGGER_VISIBLE_BUTTON, this.isVisibleButton);
    };

    hideButton = () => {
        this.isVisibleButton = false;
        eventEmitter.emit(EVENTS.TOGGLE_VISIBLE_BUTTON, this.isVisibleButton);
        this.storage.set(STORAGE.DEBUGGER_VISIBLE_BUTTON, this.isVisibleButton);
    };

    show = () => {
        this.isVisible = true;
        eventEmitter.emit(EVENTS.TOGGLE_VISIBLE, this.isVisible);
    };

    hide = () => {
        this.isVisible = false;
        eventEmitter.emit(EVENTS.TOGGLE_VISIBLE, this.isVisible);
    };

    onChangeVisible = (callBack: (value: boolean) => void) => {
        eventEmitter.on(EVENTS.TOGGLE_VISIBLE, callBack);

        return () => eventEmitter.removeListener(EVENTS.TOGGLE_VISIBLE, callBack);
    };

    onChangeVisibleButton = (callBack: (value: boolean) => void) => {
        eventEmitter.on(EVENTS.TOGGLE_VISIBLE_BUTTON, callBack);

        return () => eventEmitter.removeListener(EVENTS.TOGGLE_VISIBLE_BUTTON, callBack);
    };

    onChangeEnabled = (callBack: (value: boolean) => void) => {
        eventEmitter.on(EVENTS.TOGGLE_ENABLE, callBack);

        return () => eventEmitter.removeListener(EVENTS.TOGGLE_ENABLE, callBack);
    };
    removeAllListeners() {
        eventEmitter.removeAllListeners();
    }
}
