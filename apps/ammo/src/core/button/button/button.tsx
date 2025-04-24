import React from 'react';

import { View } from 'react-native';

import { Text, Touchable } from '~/core';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './button.style';
import { type IButtonProps } from './button.types';

export const Button = ({ onPress, title, style, right, left, disabled, testID, color }: IButtonProps) => {
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();

    return (
        <View style={[s.container, style, disabled && s.disabled]} testID={`${testID}.button`}>
            <View>{left}</View>
            <Text type="p3" text={title} color={color ?? theme.colors.white} />
            <View>{right}</View>
            <Touchable type="rect" disabled={disabled} onPress={onPress} style={styles.touchable} testID={testID} />
        </View>
    );
};
