import { type IViewStyle } from '~/types';

export type ILoadingProps = {
    isVisible: boolean;
    style?: IViewStyle;
    color?: string;
    size?: number | 'small' | 'large' | undefined;
};
