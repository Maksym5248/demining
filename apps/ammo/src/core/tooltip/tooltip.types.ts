import { type ReactNode } from 'react';

import { type IViewStyle } from '~/types';

export type ITooltipProps = {
    text: string;
    children: ReactNode;
    style?: IViewStyle;
    delay?: number;
};
