import React from 'react';

import { isArray } from 'lodash';
import { Text as TextRN, type TextStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import { toUpper } from '~/utils';

import { useStyles } from './text.styles';
import { type ITextProps } from './text.types';

export const Text = ({
    type = 'p3',
    text,
    children,
    color,
    size,
    style,
    onPress,
    testID,
    isAnimated,
    uppercase = false,
    ...props
}: ITextProps) => {
    const s = useStyles();

    const typeStyle = s[type];

    const additionalStyles: TextStyle = {};

    if (color) {
        additionalStyles.color = color;
    }

    if (size) {
        additionalStyles.fontSize = size;
    }

    const Txt = isAnimated ? Animated.Text : TextRN;

    return (
        // @ts-ignore
        <Txt {...props} testID={testID} onPress={onPress} style={[typeStyle, ...(isArray(style) ? style : [style]), additionalStyles]}>
            {(!!uppercase && !!text ? toUpper(String(text)) : text) || children}
        </Txt>
    );
};
