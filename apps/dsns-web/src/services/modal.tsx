import { ReactNode } from 'react';

import EventEmitter from 'events';

import { Analytics } from './analytics';

const eventEmitter = new EventEmitter();

interface IPropsForComponent {
    hide?: () => void;
}

interface IModalType {
    propsForComponent?: IPropsForComponent;
    renderComponent: (props: any) => ReactNode;
}

export interface IModalTypeInternal extends IModalType {
    name: string;
    isVisible: boolean;
    isRendered: boolean;
}

export interface IModalsMap {
    [key: string]: IModalType;
}

export interface IModalsMapInternal {
    [key: string]: IModalTypeInternal;
}

enum Events {
    Change = 'change',
}

class ModalClass {
    private _modals: IModalTypeInternal[];

    visibleModals: IModalsMapInternal;

    constructor() {
        this._modals = [];
        this.visibleModals = {};
    }

    registerModals(modals: IModalsMap) {
        const arr = Object.entries(modals) as [string, IModalTypeInternal][];

        this._modals = arr.map((current) => {
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
        Analytics.modal(name);
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

export const Modal = new ModalClass();
