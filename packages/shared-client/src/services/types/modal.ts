import { type ReactNode } from 'react';

export interface IIModalPropsForComponent {
    hide?: () => void;
}

export interface IModalView {
    isVisible: boolean;
    hide: () => void;
    open: () => void;
}

export interface IModalType {
    propsForComponent?: IIModalPropsForComponent;
    renderComponent: (props: IModalView & Record<string, unknown>) => ReactNode;
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
    show: (name: string, props?: any) => void;
    hide: (name: string) => void;
    hideAll: () => void;
}
