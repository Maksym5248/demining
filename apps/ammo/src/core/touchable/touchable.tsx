import React from 'react';

import { View } from 'react-native';
import { RectButton, BorderlessButton } from 'react-native-gesture-handler';

import { ThemeManager } from '~/styles';

import { type ITouchable, type ITouchableComponent } from './touchable.types';

const hitSlop = {
    top: 5,
    right: 15,
    bottom: 15,
    left: 5,
};

/**
 * Note: border doesn't work android with RectButton or BorderlessButton
 */

export function Touchable({
    children,
    rippleColor = ThemeManager.theme.colors.ripplePrimary,
    onPress,
    disabled,
    contentStyle,
    type = 'borderLess',
    ...rest
}: ITouchable) {
    let Component: ITouchableComponent = RectButton;

    if (!onPress) {
        Component = View;
    } else if (type === 'borderLess') {
        Component = BorderlessButton;
    }

    return (
        <Component
            hitSlop={type === 'borderLess' ? hitSlop : undefined}
            underlayColor={rippleColor}
            activeOpacity={type === 'borderLess' ? 0.3 : 1}
            enabled={!disabled}
            // @ts-ignore
            onPress={disabled ? undefined : onPress}
            rippleColor={rippleColor}
            {...rest}>
            <View accessible accessibilityRole="button" style={contentStyle}>
                {children}
            </View>
        </Component>
    );
}
