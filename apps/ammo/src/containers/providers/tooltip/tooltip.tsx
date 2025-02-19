import React, { useState, memo, useCallback, useMemo, useRef, type Component } from 'react';

import { View } from 'react-native';
import Animated, { useSharedValue, withTiming, runOnJS, useAnimatedStyle, useAnimatedRef, type AnimatedRef } from 'react-native-reanimated';
import { useAsyncEffect } from 'shared-my-client';

import { TooltipContext, TooltipRootContext } from '~/context';
import { Icon, Text } from '~/core';
import { useTheme, useDevice } from '~/styles';
import { measureSize } from '~/utils';

import { useStyles } from './tooltip.styles';
import { type ITooltipProviderProps } from './tooltip.types';

const initialData = {
    text: '',
    isVisible: false,
};

const getLeftOffset = (childrenSize: { width: number }, size: { height: number; width: number }) => ({
    y: size?.height + 10,
    x: size?.width / 2 - childrenSize?.width / 2,
});

const getRightOffset = (size: { width: number }, offset: { x: number }) => ({
    y: 0,
    x: size.width - offset.x,
});

const getCenterPosition = (childrenSize: { pageY: number; pageX: number }, offset: { x: number; y: number }) => ({
    y: childrenSize.pageY - offset.y,
    x: childrenSize.pageX - offset.x,
});

export const TooltipProvider = memo(({ children }: ITooltipProviderProps) => {
    const s = useStyles();
    const theme = useTheme();
    const aref = useAnimatedRef();
    const self = useRef<{
        id?: string;
        childRef: AnimatedRef<Component<any>> | null;
    }>({
        id: undefined,
        childRef: null,
    }).current;
    const device = useDevice();

    const opacity = useSharedValue(0);
    const y = useSharedValue(0);
    const x = useSharedValue(-1000);
    const yContent = useSharedValue(0);
    const xContent = useSharedValue(0);

    const [data, setData] = useState({ ...initialData });

    const onHide = useCallback(() => {
        setData({ ...initialData });

        y.value = 0;
        x.value = 0;
        xContent.value = -1000;
        yContent.value = 0;
        self.childRef = null;
    }, [setData, xContent, yContent, x, y]);

    useAsyncEffect(async () => {
        if (!data?.isVisible) {
            opacity.value = withTiming(
                0,
                {
                    duration: 200,
                },
                () => runOnJS(onHide)(),
            );

            self.id = undefined;
            self.childRef = null;
        } else {
            requestAnimationFrame(async () => {
                const childrenSize = await measureSize(self.childRef);
                //@ts-ignore
                const size = await measureSize(aref);

                if (childrenSize?.pageY && childrenSize?.pageX) {
                    const offsetLeft = getLeftOffset(childrenSize, size);
                    const offsetRight = getRightOffset(size, offsetLeft);

                    const center = getCenterPosition(childrenSize, offsetLeft);

                    y.value = center.y;
                    x.value = center.x;

                    if (childrenSize?.pageX <= offsetLeft.x) {
                        xContent.value = offsetLeft.x - childrenSize?.pageX + 5;
                    } else if (device.window.width <= offsetRight.x + childrenSize?.pageX) {
                        xContent.value = device.window.width - offsetRight.x - childrenSize?.pageX - 5;
                    } else {
                        xContent.value = 0;
                    }

                    opacity.value = withTiming(1, {
                        duration: 200,
                    });
                }
            });
        }
    }, [data?.isVisible]);

    const value = useMemo(
        () => ({
            hide: () => {
                setData({ isVisible: false, text: '' });
            },
            show: async ({ id, text }: { id: string; text: string }, ref: any) => {
                setData({ isVisible: true, text });
                self.id = id;
                //@ts-ignore
                self.childRef = ref;
            },
        }),
        [setData, onHide, opacity, x, y, aref, self, xContent],
    );

    const containerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateX: x.value }, { translateY: y.value }],
    }));

    const contentStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: xContent.value }, { translateY: yContent.value }],
    }));

    const root = useMemo(
        () => ({
            onScrollBegin: () => {
                opacity.value = 0;
                onHide();
            },
            hide: () => {
                opacity.value = 0;
                onHide();
            },
        }),
        [onHide, opacity],
    );

    const onPress = useCallback(() => {
        root.hide();
    }, [root]);

    return (
        <TooltipRootContext.Provider value={root}>
            <TooltipContext.Provider value={value}>
                {children}
                <Animated.View ref={aref} style={[s.container, containerStyle]} pointerEvents="box-none">
                    <Animated.View style={[s.content, contentStyle]}>
                        <View style={s.textContainer}>
                            <Text type="p5" color={theme.colors.textSecondary} style={s.text} text={data?.text} />
                        </View>
                        <Icon name="close" size={15} style={s.close} color={theme.colors.textSecondary} onPress={onPress} />
                    </Animated.View>
                    <View style={s.corner} />
                </Animated.View>
            </TooltipContext.Provider>
        </TooltipRootContext.Provider>
    );
});

TooltipProvider.displayName = 'TooltipProvider';
