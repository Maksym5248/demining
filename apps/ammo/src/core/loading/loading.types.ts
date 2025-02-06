import { type ViewStyle } from 'react-native';

export type ILoadingProps = {
    isVisible: boolean;
    style?: ViewStyle;
    color?: string;
    size?: number | 'small' | 'large' | undefined;
};
