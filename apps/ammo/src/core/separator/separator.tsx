import React from 'react';

import { View } from 'react-native';

import { ThemeManager } from '~/styles';

import { useStyles } from './separator.styles';
import { type ISeparatorProps } from './separator.types';

export const Separator = ({ style, type = 'horizontal', color = ThemeManager.theme.colors.inert }: ISeparatorProps) => {
    const s = useStyles();
    const isHorizontal = type === 'horizontal';

    return <View style={[s.container, style, isHorizontal && s.horizontal, { backgroundColor: color }]} />;
};
