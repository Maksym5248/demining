import { type ReactNode } from 'react';

import { type ViewStyle } from 'react-native';

export interface IButtonProps {
    title?: string;
    style?: ViewStyle;
    onPress?: () => void;
    disabled?: boolean;
    right?: ReactNode;
    left?: ReactNode;
    testID?: string;
}
