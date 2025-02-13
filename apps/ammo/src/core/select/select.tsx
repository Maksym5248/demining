import React from 'react';

import { Icon, Text, Touchable } from '~/core';
import { useTranslate } from '~/localization';
import { useTheme } from '~/styles';

import { useStyles } from './select.style';
import { type ISelectProps } from './select.types';

export const Select = ({ onPress, placeholder, value, right, style }: ISelectProps) => {
    const theme = useTheme();
    const s = useStyles();
    const t = useTranslate('core.select');

    return (
        <Touchable type="rect" style={[s.container, style]} onPress={onPress}>
            <Text
                type="p4"
                text={value ?? placeholder ?? t('placeholder')}
                color={value ? theme.colors.text : theme.colors.textSecondary}
            />
            {right}
            {!right && !!value && <Icon name="close" color={theme.colors.textSecondary} />}
            {!right && !value && <Icon name="arrow-down" color={theme.colors.textSecondary} />}
        </Touchable>
    );
};
