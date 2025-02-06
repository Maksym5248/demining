import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type TextStyle, type StyleProp, type Text } from 'react-native';

import { type ITextStyleType } from '~/styles';

export type ITextProps = ComponentPropsWithRef<typeof Text> & {
    type?: ITextStyleType;
    text?: string | number;
    children?: ReactNode;
    style?: StyleProp<TextStyle> | undefined;
    color?: string;
    size?: number;
    onPress?: () => void;
    testID?: string;
    isAnimated?: boolean;
    uppercase?: boolean;
};
