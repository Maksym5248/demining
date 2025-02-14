import { type ComponentPropsWithRef, type ReactNode, type ElementType } from 'react';
import type React from 'react';

import { type ViewStyle, type View, type StyleProp } from 'react-native';
import { type RectButton, type BorderlessButton } from 'react-native-gesture-handler';

export type ITouchableComponent = typeof RectButton | typeof BorderlessButton | typeof View;

type Optional<T extends ElementType> = Omit<ComponentPropsWithRef<T>, 'onPress'>;

export type ITouchable = Optional<typeof RectButton> &
    Optional<typeof BorderlessButton> &
    Optional<typeof View> & {
        children?: ReactNode;
        style?: StyleProp<ViewStyle> | undefined;
        type?: 'rect' | 'borderLess';
        disabled?: boolean;
        onPress?: (e?: React.FormEvent<any> | undefined) => void;
    };
