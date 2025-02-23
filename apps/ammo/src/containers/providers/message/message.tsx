import React, { useState, useEffect, memo, useRef, useCallback } from 'react';

import { View, StatusBar } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS, interpolate } from 'react-native-reanimated';

import { Text, Icon } from '~/core';
import { Message } from '~/services';
import { type IMessageState } from '~/services/ui/message';
import { useDevice, useTheme } from '~/styles';

import { useStyles } from './message.styles';

const Component = () => {
    const s = useStyles();
    const theme = useTheme();
    const device = useDevice();

    const animated = useSharedValue(0);
    const self = useRef<{ timer: NodeJS.Timeout | null }>({
        timer: null,
    }).current;
    const [data, setData] = useState<IMessageState>();

    const { isVisible, text, type } = data ?? { isVisible: false, text: '', type: 'info' };

    const clearTimer = useCallback(() => {
        if (self.timer) {
            clearTimeout(self.timer);
            self.timer = null;
        }
    }, [self]);

    const onHide = useCallback(() => Message.hide(), []);

    const onClose = useCallback(
        (newData: IMessageState) => {
            const onEndAnimation = () => {
                setData(newData);
            };
            animated.value = withTiming(0, { duration: 200 }, () => runOnJS(onEndAnimation)());
        },
        [self, animated],
    );

    const onShow = useCallback(
        (state: IMessageState) => {
            setData(state);

            self.timer = setTimeout(() => {
                requestAnimationFrame(() => {
                    StatusBar.setBarStyle('light-content');
                    animated.value = withTiming(1, { duration: 200 });

                    if (state?.params?.time) {
                        self.timer = setTimeout(onHide, state?.params?.time);
                    }
                });
            }, state?.params?.delay);
        },
        [self, animated, onHide],
    );

    useEffect(() => {
        const removeListener = Message.onChange(newData => {
            clearTimer();

            if (newData?.isVisible) {
                onShow(newData);
            } else {
                onClose(newData);
            }
        });

        return () => {
            removeListener();
        };
    }, [animated, self, clearTimer, onShow, onClose]);

    const HEADER_HEIGHT = ((theme.element.header.height as number) ?? 0) + (device.inset.top ?? 0);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: animated.value,
        transform: [{ translateY: interpolate(animated.value, [0, 1], [-HEADER_HEIGHT, 0]) }],
    }));

    useEffect(() => clearTimer, [clearTimer]);

    const getColor = () => {
        switch (type) {
            case 'error':
                return theme.colors.white;
            case 'success':
                return theme.colors.white;
            default:
                return theme.colors.white;
        }
    };

    return (
        isVisible && (
            <Animated.View style={[s.container, type === 'error' && s.error, type === 'success' && s.success, containerStyle]}>
                <View style={s.content}>
                    <Text type="p4" color={getColor()} text={text} />
                    <Icon size={14} name="close" style={s.icon} color={getColor()} onPress={onHide} />
                </View>
            </Animated.View>
        )
    );
};

export const MessageProvider = memo(Component);
