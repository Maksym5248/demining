import { type ViewStyle } from 'react-native';

import { type ISharedValue } from '~/types';

export interface IPaginationProps {
    number: number;
    animatedIndex: ISharedValue;
    style?: ViewStyle;
    color?: string;
    dotSize?: number;
    isScale?: boolean;
    opacity?: number;
}
