import { type ReactNode, type ReactElement } from 'react';

import { type IViewStyle } from '~/types';

export interface IBottomSheetProps {
    onClose: (value: { canceled: boolean }) => void;
    children: ReactNode | ReactElement;
    onPressClose?: () => void;
    enabledSwipe?: boolean;
    enableHideOnPressBackground?: boolean;
    contentStyle?: IViewStyle;
    header?: {
        left?: ReactNode;
        center?: ReactNode;
        right?: ReactNode;
    };
}

export interface IBottomSheetRef {
    close: (triggerCancel?: boolean) => void;
}
