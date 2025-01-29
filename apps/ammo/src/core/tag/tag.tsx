import React from 'react';

import { View } from 'react-native';

import { ThemeManager } from '~/styles';

import { useStyles } from './tag.styles';
import { type ITagProps } from './tag.types';
import { Text } from '../text';

export const Tag = ({
    style,
    backgroundColor = ThemeManager.theme.colors.accentLight,
    color = ThemeManager.theme.colors.text,
    text,
}: ITagProps) => {
    const s = useStyles();

    return (
        <View style={[s.container, style, { backgroundColor }]} pointerEvents="none">
            <Text color={color} text={text} type="p5" />
        </View>
    );
};
