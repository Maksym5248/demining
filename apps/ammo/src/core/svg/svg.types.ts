import { type ViewStyle } from 'react-native';

export type ISvgName = 'logo';

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
