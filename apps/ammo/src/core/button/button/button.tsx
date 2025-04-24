import React from 'react';

import { View } from 'react-native';

import { Loading, Text, Touchable } from '~/core';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './button.style';
import { type IButtonProps } from './button.types';

export const Button = ({ onPress, title, style, right, left, disabled, testID, color, isLoading, type = 'primary' }: IButtonProps) => {
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();

    const isInvert = type === 'invert';

    const typeColor = isInvert ? theme.colors.black : theme.colors.white;

    return (
        <View style={[s.container, style, isInvert && s.invert, disabled && s.disabled]} testID={`${testID}.button`}>
            <View>{left}</View>
            <Loading size="small" color={typeColor} isVisible={!!isLoading} />
            {!isLoading && <Text type="p3" text={title} color={color ?? typeColor} />}
            <View>{right}</View>
            <Touchable type="rect" disabled={disabled} onPress={onPress} style={styles.touchable} testID={testID} />
        </View>
    );
};
