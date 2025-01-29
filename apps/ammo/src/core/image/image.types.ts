import { type ImageSourcePropType, type ImageProps as RNImageProps } from 'react-native';

import { type IViewStyle, type IImageStyle } from '~/types';

export interface IImageProps extends Omit<RNImageProps, 'source' | 'style'> {
    uri?: string | null;
    style?: IViewStyle;
    imageStyle?: IImageStyle;
    placeholderStyle?: IImageStyle;
    loadingStyle?: IViewStyle;
    placeholder?: ImageSourcePropType;
    source?: ImageSourcePropType;
    onPress?: () => void;
    isAnimated?: boolean;
    onLoad?: () => void;
    resizeMode?: 'cover' | 'contain';
}
