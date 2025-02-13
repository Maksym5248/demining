import React from 'react';

import { View } from 'react-native';

import { Icon, Text, Touchable } from '~/core';
import { useTranslate } from '~/localization';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './select.style';
import { type ISelectProps } from './select.types';

export const Select = ({ onPress, placeholder, value, right, style, onClear }: ISelectProps) => {
    const theme = useTheme();
    const s = useStyles();
    const styles = useStylesCommon();
    const t = useTranslate('core.select');

    return (
        <View style={[s.container, style]}>
            <Text
                type="p4"
                text={value ?? placeholder ?? t('placeholder')}
                color={value ? theme.colors.text : theme.colors.textSecondary}
            />
            {right}
            {!right && !value && <Icon name="arrow-down" color={theme.colors.textSecondary} />}
            <Touchable type="rect" onPress={onPress} style={styles.touchable} />
            {!right && !!value && <Icon name="close" color={theme.colors.textSecondary} onPress={onClear} />}
        </View>
    );
};
