/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useMemo, useState, forwardRef, useImperativeHandle, type Ref, useRef } from 'react';

import _ from 'lodash';
import { View, type ViewStyle } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    useSharedValue,
    useAnimatedGestureHandler,
    useDerivedValue,
    withTiming,
    runOnJS,
    interpolate,
    useAnimatedStyle,
} from 'react-native-reanimated';
import { useOnChange } from 'shared-my-client';

import { type ICarouselProps, type ICarouselRef } from './carousel.types';

const options = { duration: 250, easing: Easing.bezier(0, 0, 0.58, 1.0) };

const CarouselComponent = forwardRef<ICarouselRef, ICarouselProps>((props: ICarouselProps, ref: Ref<ICarouselRef>) => {
    const {
        itemWidth = 0,
        initialIndex = 0,
        data = [],
        width = 0,
        style,
        containerStyle,
        contentContainerStyle,
        renderItem,
        renderFooter,
        keyExtractor,
        isFooterInsideTouchable = true,
        lazy = false,
        onChangedIndex,
        delayChangeIndexCallBack = 700,
    } = props;

    const self = useRef<{ timer: null | NodeJS.Timeout }>({
        timer: null,
    }).current;
    const [index, setIndex] = useState(initialIndex);

    const offset = useSharedValue(0);
    const currentIndex = useSharedValue(initialIndex);
    const dataLength = useSharedValue(data.length);
    const lastUpdatedCallBackIndex = useSharedValue(initialIndex);

    const translateX = useDerivedValue(() => currentIndex.value * -itemWidth + offset.value);
    const animatedIndex = useDerivedValue(() => interpolate(translateX.value, [-itemWidth, 0], [1, 0]));

    useOnChange(() => {
        dataLength.value = data?.length || 0;
    }, [data?.length]);

    const onCancelUpdateIndex = useCallback(() => {
        if (self.timer) {
            clearTimeout(self.timer);
            self.timer = null;
        }
    }, []);

    const onUpdatedIndex = useCallback(
        (nextIndex: number) => {
            lazy && setIndex(nextIndex);

            if (!onChangedIndex) {
                return;
            }

            if (self.timer) {
                clearTimeout(self.timer);
                self.timer = null;
            }

            self.timer = setTimeout(() => {
                lastUpdatedCallBackIndex.value = nextIndex;
                !!onChangedIndex && onChangedIndex(nextIndex);
            }, delayChangeIndexCallBack);
        },
        [onChangedIndex],
    );

    const onGestureEvent = useAnimatedGestureHandler({
        onStart: () => {
            runOnJS(onCancelUpdateIndex)();
        },
        onActive: (e) => {
            const maxIndex = dataLength.value - 1;
            if ((currentIndex.value === 0 && e.translationX > 0) || (currentIndex.value === maxIndex && e.translationX < 0)) {
                const translationX = e.translationX / 3;
                offset.value = translationX;
            } else {
                offset.value = e.translationX;
            }
        },
        onEnd: (e) => {
            const { velocityX = 0, translationX = 0 } = e;

            const nextIndex = Math.round(translationX > 0 ? currentIndex.value - 1 : currentIndex.value + 1);

            const canChangeIndex = nextIndex >= 0 && nextIndex <= data.length - 1;
            const isXValueEnough = translationX > itemWidth / 2.5 || translationX < -itemWidth / 2.5;
            const isFastGesture = Math.abs(velocityX) > 700;

            if (canChangeIndex && (isXValueEnough || isFastGesture)) {
                currentIndex.value = withTiming(nextIndex, options, () => {
                    runOnJS(onUpdatedIndex)(nextIndex);
                });
            }

            offset.value = withTiming(0, options, () => {
                if (lastUpdatedCallBackIndex.value !== currentIndex.value) {
                    runOnJS(onUpdatedIndex)(Math.round(currentIndex.value));
                }
            });
        },
    });

    const s: { [k: string]: ViewStyle } = {
        container: {
            width,
            overflow: 'hidden',
        },
        content: {
            width: data.length * itemWidth,
            flexDirection: 'row',
        },
    };

    const contentContainer = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const footer = useMemo(
        () =>
            !!renderFooter &&
            renderFooter({
                data,
                animatedIndex,
                itemWidth,
            }),
        [renderFooter, animatedIndex],
    );

    useImperativeHandle(ref, () => ({
        animatedToIdex: (nextIndex) => {
            if (currentIndex.value === nextIndex) {
                return;
            }

            currentIndex.value = withTiming(nextIndex, options, () => runOnJS(onUpdatedIndex)(Math.round(nextIndex)));
        },
    }));

    return (
        <Animated.View style={[s.container, ...(_.isArray(style) ? style : [style])]}>
            <PanGestureHandler
                activeOffsetX={[-10, 10]}
                activeOffsetY={[-1000000, 1000000]} // Number.POSITIVE_INFINITY
                onGestureEvent={onGestureEvent}
                maxPointers={1}>
                <Animated.View style={containerStyle}>
                    <Animated.View style={[s.content, contentContainerStyle, contentContainer]}>
                        {data.map((item, i) => (
                            <View key={_.isFunction(keyExtractor) ? keyExtractor(item, i) : i} style={{ width: itemWidth }}>
                                {(!lazy || (index + 2 >= i && index - 2 <= i)) && !!renderItem
                                    ? renderItem({
                                          item,
                                          animatedIndex,
                                          itemWidth,
                                          index: i,
                                      })
                                    : null}
                            </View>
                        ))}
                    </Animated.View>
                    {!!renderFooter && isFooterInsideTouchable && footer}
                </Animated.View>
            </PanGestureHandler>
            {!!renderFooter && !isFooterInsideTouchable && footer}
        </Animated.View>
    );
});

CarouselComponent.displayName = 'Carousel';

export const Carousel = memo(CarouselComponent);
