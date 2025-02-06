import { type ReactNode } from 'react';

import { type IViewStyle, type ITextStyle } from '~/types';

export interface IHeaderProps {
    style?: IViewStyle;
    centerStyle?: IViewStyle;
    title?: string;
    titleStyle?: ITextStyle;
    isTitleAnimated?: boolean;
    left?: ReactNode;
    center?: ReactNode;
    right?: ReactNode;
    pointerEvents?: 'auto' | 'none' | 'box-none';
    children?: ReactNode | ReactNode[];
    onPressBack?: () => void;
    backButton?: 'back' | 'close' | 'none';
    color?: string;
    isAnimated?: boolean;
}
