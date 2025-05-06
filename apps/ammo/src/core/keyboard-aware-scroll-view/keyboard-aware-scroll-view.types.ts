import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type ViewStyle } from 'react-native';
import { type KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export type KeyboardAwareScrollViewProps = Omit<ComponentPropsWithRef<typeof KeyboardAwareScrollView>, 'children'> & {
    contentStyle?: ViewStyle | ViewStyle[];
    children?: ReactNode;
    isAnimated?: boolean;
};
