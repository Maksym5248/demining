import React, { useCallback, useImperativeHandle, forwardRef, type Ref } from 'react';

import { TouchableWithoutFeedback, type LayoutChangeEvent, View, Text } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    runOnJS,
    interpolate,
} from 'react-native-reanimated';

import { useTranslate } from '~/localization';
import { useDevice } from '~/styles';

import { useStyles } from './bottom-sheet.styles';
import { type IBottomSheetProps, type IBottomSheetRef } from './bottom-sheet.types';
import { Touchable } from '../touchable';

const hitSlopClose = {
    top: 20,
    right: 20,
    bottom: 10,
    left: 10,
};

export const BottomSheet = forwardRef<IBottomSheetRef, IBottomSheetProps>(
    (
        {
            onClose,
            onPressClose,
            contentStyle,
            enabledSwipe = true,
            enableHideOnPressBackground = true,
            children,
            isHeader = true,
        }: IBottomSheetProps,
        ref: Ref<IBottomSheetRef>,
    ) => {
        const s = useStyles();
        const device = useDevice();
        const MAX_HEIGHT = device.window.height - 100;

        const t = useTranslate('core.bottom-sheet');

        const isVisible = useSharedValue(false);
        const height = useSharedValue(MAX_HEIGHT);
        const offset = useSharedValue(MAX_HEIGHT);

        const jsFunction = (v: number, canceled?: boolean) => {
            if (!v) {
                return;
            }

            !!onClose && onClose({ canceled: !!canceled });
        };

        const onAnimate = (toValue: number, canceled?: boolean) => {
            'worklet';
            offset.value = withTiming(
                toValue,
                {
                    duration: 250,
                },
                () => {
                    runOnJS(jsFunction)(toValue, canceled);
                },
            );
        };

        const eventHandler = useAnimatedGestureHandler({
            onStart: event => {
                offset.value = event.translationY > 0 ? event.translationY : offset.value;
            },
            onActive: event => {
                offset.value = event.translationY > 0 ? event.translationY : offset.value;
            },
            onEnd: event => {
                const isFastGesture = Math.abs(event.velocityY) > 300;
                const isYEnough = event.translationY > 50;

                const toValue = isYEnough || isFastGesture ? height.value : 0;
                onAnimate(toValue, true);
            },
        });

        const onLayout = useCallback((e: LayoutChangeEvent) => {
            const {
                nativeEvent: { layout },
            } = e;
            if (isVisible.value) {
                return;
            }

            const maxHeight = layout?.height > MAX_HEIGHT ? MAX_HEIGHT : layout?.height;

            offset.value = maxHeight;
            height.value = maxHeight;

            offset.value = withTiming(0, {
                duration: 200,
            });

            isVisible.value = true;
        }, []);

        const contentStyles = useAnimatedStyle(() => {
            return {
                maxHeight: MAX_HEIGHT,
                transform: [
                    {
                        translateY: offset.value,
                    },
                ],
            };
        }, []);

        const backgroundStyles = useAnimatedStyle(() => {
            const opacity = 0.4;
            const value = height.value > 0 ? offset.value / height.value : 0;

            return {
                opacity: interpolate(value, [0, 1], [opacity, 0]),
            };
        }, []);

        useImperativeHandle(ref, () => ({
            close: (canceled: boolean = false) => onAnimate(height.value, canceled),
        }));

        const onPressCancel = () => {
            onAnimate(height.value, true);
        };

        return (
            <View style={s.container}>
                <Animated.View style={[s.background, backgroundStyles]}>
                    <TouchableWithoutFeedback onPress={enableHideOnPressBackground ? onPressCancel : undefined}>
                        <View style={s.backgroundButton} />
                    </TouchableWithoutFeedback>
                </Animated.View>
                <PanGestureHandler enabled={enabledSwipe} onGestureEvent={eventHandler}>
                    <Animated.View style={[s.content, contentStyle, contentStyles]} onLayout={onLayout}>
                        {!!isHeader && (
                            <View style={s.header}>
                                <Touchable onPress={onPressClose || onPressCancel} hitSlop={hitSlopClose}>
                                    <Text style={s.textClose}>{t('close')}</Text>
                                </Touchable>
                            </View>
                        )}
                        {children}
                    </Animated.View>
                </PanGestureHandler>
            </View>
        );
    },
);

BottomSheet.displayName = 'BottomSheet';
