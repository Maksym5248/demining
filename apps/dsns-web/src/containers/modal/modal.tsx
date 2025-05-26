import React from 'react';

import { type IModalsMapInternal, type IModalTypeInternal, type IModalsMap } from 'shared-my-client';

import { SESSION_STORAGE } from '~/constants';
import { Modal, SessionStorage } from '~/services';

interface IModalProviderProps {
    modals: IModalsMap;
}

interface IModalProviderState {
    modals: IModalTypeInternal[];
    visibleModals: IModalsMapInternal;
}

export class ModalProvider extends React.PureComponent<IModalProviderProps, IModalProviderState> {
    _removeListener: () => void;

    constructor(props: IModalProviderProps) {
        super(props);

        this.state = {
            modals: Modal.registerModals(props.modals),
            visibleModals: SessionStorage.get(SESSION_STORAGE.MODAL_STATE) ?? {},
        };

        this._removeListener = () => undefined;
    }

    componentDidMount() {
        this._removeListener = Modal.onChange(async nextState => {
            this.setState(
                prev => ({
                    ...prev,
                    visibleModals: nextState,
                }),
                () => {},
            );

            SessionStorage.set(SESSION_STORAGE.MODAL_STATE, nextState);
        });
    }
    // test
    componentWillUnmount() {
        this._removeListener();
    }

    onModalHide = (name: string) => {
        Modal.hide(name);
    };

    onModalShow = (name: string, propsForComponent = {}) => {
        Modal.show(name, propsForComponent);
    };

    render() {
        const { modals, visibleModals } = this.state;

        if (modals.length === 0) {
            return null;
        }

        return modals.map((modal: IModalTypeInternal) => {
            const visibleModal = visibleModals[modal.name];
            const propsForComponent = {
                ...modal?.propsForComponent,
                ...visibleModal?.propsForComponent,
            };

            return (
                <div key={modal.name}>
                    {visibleModal?.isRendered &&
                        modal.renderComponent({
                            ...propsForComponent,
                            isVisible: visibleModal?.isVisible,
                            hide: () => this.onModalHide(modal.name),
                            open: () => this.onModalShow(modal.name),
                        })}
                </div>
            );
        });
    }
}
