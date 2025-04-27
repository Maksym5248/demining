import { type ReactNode } from 'react';

import { type IViewStyle } from '~/types';

export interface IButtonProps {
    title?: string;
    style?: IViewStyle;
    onPress?: () => void;
    disabled?: boolean;
    right?: ReactNode;
    center?: ReactNode;
    left?: ReactNode;
    testID?: string;
    color?: string;
    type?: 'invert' | 'primary';
    isLoading?: boolean;
}
