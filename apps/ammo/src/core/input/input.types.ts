import { type ComponentPropsWithRef, type ReactNode } from 'react';

import { type TextInput } from 'react-native';

import { type IViewStyle, type ITextStyle, type Mask } from '~/types';

export type IInputProps = ComponentPropsWithRef<typeof TextInput> & {
    onChangeValue?: (text: string) => void;
    style?: IViewStyle;
    contentStyle?: IViewStyle;
    inputStyle?: IViewStyle;
    labelStyle?: ITextStyle;
    label?: string;
    testID?: string;
    isValid?: boolean;
    isClearable?: boolean;
    message?: string | ReactNode;
    right?: ReactNode;
    left?: ReactNode;
    secureTextEntryIcon?: boolean;
    mask?: Mask;
    isSmallLabelSmall?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
};
