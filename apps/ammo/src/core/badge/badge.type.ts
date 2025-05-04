import { type IViewStyle } from '~/types';

export interface IBadgeProps {
    children?: React.ReactNode;
    count?: number;
    style?: IViewStyle;
    color?: string;
}
