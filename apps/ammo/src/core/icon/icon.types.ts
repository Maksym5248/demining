import { type ViewStyle } from 'react-native';

import { type svgIcons } from '~/assets';

export type IIconName = keyof typeof svgIcons;

export interface IIconProps {
    name: IIconName;
    size?: number;
    color?: string;
    secondColor?: string;
    style?: ViewStyle;
    svgStyle?: ViewStyle;
    contentStyle?: ViewStyle;
    onPress?: () => void;
    disabled?: boolean;
}
