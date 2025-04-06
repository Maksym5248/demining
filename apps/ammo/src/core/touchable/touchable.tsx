import React from 'react';

import { View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { ThemeManager, useStylesCommon } from '~/styles';

import { type ITouchable, type ITouchableComponent } from './touchable.types';

const hitSlop = {
    top: 5,
    right: 15,
    bottom: 15,
    left: 5,
};

const BORDER_LESS_RADIUS = 100;
/**
 * Note: border doesn't work android with RectButton or BorderlessButton
 */
export function Touchable({
    children,
    rippleColor = ThemeManager.theme.colors.ripplePrimary,
    onPress,
    disabled,
    type = 'borderLess',
    style,
    ...rest
}: ITouchable) {
    const styles = useStylesCommon();

    let Component: ITouchableComponent = RectButton;

    if (!onPress) {
        Component = View;
    }

    const isBorderLess = type === 'borderLess';

    return (
        <View style={style}>
            {children}
            <Component
                hitSlop={isBorderLess ? hitSlop : undefined}
                underlayColor={rippleColor as string}
                activeOpacity={1}
                // borderless={type === 'borderLess'}
                enabled={!disabled}
                // @ts-ignore
                onPress={disabled ? undefined : onPress}
                rippleColor={rippleColor}
                {...rest}
                style={[styles.touchable, isBorderLess ? { borderRadius: BORDER_LESS_RADIUS } : undefined]}
            />
        </View>
    );
}
