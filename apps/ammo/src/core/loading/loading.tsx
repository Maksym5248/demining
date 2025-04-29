import React from 'react';

import { ActivityIndicator, View } from 'react-native';

import { ThemeManager, useTheme } from '~/styles';

import { useStyles } from './loading.styles';
import { type ILoadingProps } from './loading.types';

export const Loading = ({ isVisible, style, color = ThemeManager.theme.colors.accent, size = 52 }: ILoadingProps) => {
    const s = useStyles();
    const theme = useTheme();

    return (
        !!isVisible && (
            <View style={[s.container, style]} pointerEvents="none">
                <ActivityIndicator size={size} color={color ?? theme.colors.accent} />
            </View>
        )
    );
};
