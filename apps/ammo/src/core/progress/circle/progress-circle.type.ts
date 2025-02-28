import { type IViewStyle } from '~/types';

export interface ProgressCircularProps {
    size?: number;
    strokeWidth?: number;
    progress: number;
    color?: string;
    backgroundColor?: string;
    style?: IViewStyle;
}
