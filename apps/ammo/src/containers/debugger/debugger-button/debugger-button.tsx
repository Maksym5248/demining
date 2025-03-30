import React, { useState, useEffect, memo } from 'react';

import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, useAnimatedGestureHandler } from 'react-native-reanimated';

import { Icon } from '~/core';
import { Debugger } from '~/services';
import { useTheme } from '~/styles';
import { Device } from '~/utils';

import { useStyles } from './debugger-button.styles';

export const DebuggerButton = memo(() => {
    const s = useStyles();
    const theme = useTheme();

    const [isVisible, setVisible] = useState(Debugger.isVisibleButton);

    console.log('DebuggerButton', isVisible);

    const translateY = useSharedValue(45);
    const translateX = useSharedValue(Device.window.width / 2 - 25);

    const opacity = useSharedValue(0);

    useEffect(() => {
        Debugger.onChangeVisibleButton(value => setVisible(!!value));
    }, []);

    const onPress = () => {
        Debugger.isVisible ? Debugger.hide() : Debugger.show();
    };

    useEffect(() => {
        opacity.value = withTiming(isVisible ? 1 : 0, {
            duration: 500,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    const onGestureEvent = useAnimatedGestureHandler({
        // onStart: event => {
        //     translateX.value = event.absoluteX - 25;
        //     translateY.value = event.absoluteY - 25;
        // },
        onActive: event => {
            translateX.value = event.absoluteX - 25;
            translateY.value = event.absoluteY - 25;
        },
        onEnd: event => {
            translateX.value = event.absoluteX - 25;
            translateY.value = event.absoluteY - 25;
        },
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: translateY.value,
            },
            {
                translateX: translateX.value,
            },
        ],
        opacity: opacity.value,
    }));

    return isVisible ? (
        <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View style={[animatedStyle, s.button]}>
                <Icon name="debugger" size={26} color={theme.colors.accent} onPress={onPress} />
            </Animated.View>
        </PanGestureHandler>
    ) : null;
});

DebuggerButton.displayName = 'DebuggerButton';
