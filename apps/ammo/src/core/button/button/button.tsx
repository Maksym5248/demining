import React from 'react';

import { View } from 'react-native';

import { Loading, Text, Touchable } from '~/core';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './button.style';
import { type IButtonProps } from './button.types';

export const Button = ({
    onPress,
    title,
    style,
    right,
    left,
    disabled,
    testID,
    color,
    isLoading,
    center,
    type = 'primary',
}: IButtonProps) => {
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();

    const isInvert = type === 'invert';
    const isAccent = type === 'accent';

    let typeColor = theme.colors.white;
    let typeContainer = undefined;

    if (isInvert) {
        typeColor = theme.colors.black;
        typeContainer = s.invert;
    }

    if (isAccent) {
        typeColor = theme.colors.black;
        typeContainer = s.accent;
    }

    return (
        <View style={[s.container, style, typeContainer, disabled && s.disabled]} testID={`${testID}.button`}>
            <View>{left}</View>
            {!!isLoading && <Loading size="small" color={typeColor} isVisible />}
            {!isLoading && !!title && <Text style={s.title} type="p3" text={title} color={color ?? typeColor} />}
            {!isLoading && !!center && center}
            <View>{right}</View>
            <Touchable type="rect" disabled={disabled} onPress={onPress} style={styles.touchable} testID={testID} />
        </View>
    );
};
