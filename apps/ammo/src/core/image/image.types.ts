import { type ImageSourcePropType, type Image as Img } from 'react-native';

import { type IViewStyle, type IImageStyle } from '~/types';

export interface IImageProps extends Img {
    uri?: string;
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
