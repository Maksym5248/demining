import { type IViewStyle } from '~/types';

import { type IImageProps } from '../image';

export type IAvatarProps = IImageProps & {
    size?: number;
    style?: IViewStyle;
    onPress?: () => void;
};
