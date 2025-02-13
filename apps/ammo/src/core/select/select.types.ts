import { type ReactNode } from 'react';

import { type ViewStyle } from 'react-native';

export interface ISelectProps {
    value?: string;
    style?: ViewStyle;
    onPress?: () => void;
    disabled?: boolean;
    right?: ReactNode;
    placeholder?: string;
}
