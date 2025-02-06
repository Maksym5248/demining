import { type ViewStyle } from 'react-native';

import { type svgImages } from '~/assets';

export type ISvgName = keyof typeof svgImages;

export interface ISvgProps {
    name: ISvgName;
    size?: number;
    color?: string;
    secondColor?: string;
    style?: ViewStyle;
    svgStyle?: ViewStyle;
    contentStyle?: ViewStyle;
    onPress?: () => void;
    disabled?: boolean;
}
