import EventEmitter from 'events';

import { type IModalTypeInternal, type IAnalytics, type IModalsMapInternal, type IModalsMap, type IModal } from './types';

const eventEmitter = new EventEmitter();

enum Events {
    Change = 'change',
}

export class Modal implements IModal {
    private _modals: IModalTypeInternal[];

    visibleModals: IModalsMapInternal;

    constructor(private analytics: IAnalytics) {
        this._modals = [];
        this.visibleModals = {};
    }

    registerModals(modals: IModalsMap) {
        const arr = Object.entries(modals);

        this._modals = arr.map(current => {
            const [key, value] = current;

            return {
                // @ts-ignore
                name: key,
                // @ts-ignore
                isVisible: false,
                // @ts-ignore
                isRendered: false,
                propsForComponent: {
                    hide: () => this.hide(key),
                },
                propsForModal: {},
                ...value,
            };
        }, {});

        return this._modals;
    }

    show(name: string, propsForComponent = {}, propsForModal = {}) {
        Object.assign(this.visibleModals, {
            [name]: {
                name,
                propsForComponent,
                propsForModal,
                isVisible: true,
                isRendered: true,
            },
        });

        eventEmitter.emit(Events.Change, { ...this.visibleModals });
    }

    hide(name: string) {
        this.visibleModals[name] = {
            ...this.visibleModals[name],
            isVisible: false,
            isRendered: true,
        };

        eventEmitter.emit(Events.Change, { ...this.visibleModals });

        setTimeout(() => {
            this.visibleModals[name] = {
                ...this.visibleModals[name],
                isVisible: false,
                isRendered: false,
            };

            eventEmitter.emit(Events.Change, { ...this.visibleModals });
        }, 400);
    }

    removeVisibleModal(name: string) {
        delete this.visibleModals[name];
        eventEmitter.emit(Events.Change, { ...this.visibleModals });
    }

    hideAll() {
        this.visibleModals = {};
        eventEmitter.emit(Events.Change, { ...this.visibleModals });
    }

    onChange = (callBack: (visibleModals: IModalsMapInternal) => void) => {
        eventEmitter.on(Events.Change, callBack);

        return () => eventEmitter.removeListener(Events.Change, callBack);
    };

    removeAllListeners() {
        eventEmitter.removeAllListeners();
    }
}
