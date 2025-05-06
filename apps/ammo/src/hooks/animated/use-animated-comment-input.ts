import { useCallback, useMemo } from 'react';

import {
    interpolate,
    useAnimatedKeyboard,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { useDevice, useTheme } from '~/styles';

export const useAnimatedCommentInput = () => {
    const device = useDevice();
    const theme = useTheme();

    const visible = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const commentInputHeight = useSharedValue(0);
    const commentPreviewY = useSharedValue(0);
    const keyboard = useAnimatedKeyboard({
        isStatusBarTranslucentAndroid: true,
    });

    const onMeasureCommentPreview = useCallback((e: any) => {
        const windowHeight = device.window.height - device.inset.top - (Number(theme.element.header.height) ?? 0);
        commentPreviewY.value = e.pageY - e.height - windowHeight;

        if (device.window.height - e.pageY > 0) {
            visible.value = withTiming(1, { duration: 200 });
        }
    }, []);

    const onLayoutCommentInput = useCallback((event: any) => {
        const { height } = event.nativeEvent.layout;
        commentInputHeight.value = height;
    }, []);

    const onScroll = useAnimatedScrollHandler(
        {
            onMomentumEnd: e => {
                scrollY.value = e.contentOffset.y;

                if (e.contentOffset.y > commentPreviewY.value + 150) {
                    visible.value = withTiming(1, { duration: 200 });
                } else {
                    visible.value = withTiming(0, { duration: 200 });
                }
            },
        },
        [],
    );

    const commentStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(visible.value, [0, 1], [commentInputHeight.value, 0]) - keyboard.height.value,
                },
            ],
        };
    }, []);

    const containerStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: -keyboard.height.value,
                },
            ],
        };
    }, []);

    return useMemo(
        () => ({
            styles: commentStyles,
            containerStyles,
            onLayoutCommentInput,
            onMeasureCommentPreview,
            onScroll,
        }),
        [],
    );
};
