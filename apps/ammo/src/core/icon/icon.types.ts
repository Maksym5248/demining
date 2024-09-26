import { type ViewStyle } from 'react-native';

export type IIconName = 'dictionary';

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
