import { type ReactNode } from 'react';

export interface IIModalPropsForComponent {
    hide?: () => void;
}

export interface IModalType {
    propsForComponent?: IIModalPropsForComponent;
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

export interface IModal {
    show: (name: string, propsForComponent?: any, propsForModal?: any) => void;
    hide: (name: string) => void;
    removeVisibleModal: (name: string) => void;
    hideAll: () => void;
    onChange: (callBack: (visibleModals: IModalsMapInternal) => void) => () => void;
    removeAllListeners: () => void;
}
