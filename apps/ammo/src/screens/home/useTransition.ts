import { useCallback, useRef, useState } from 'react';

import { Animated, Easing } from 'react-native';

import { useDevice } from '~/styles';

export const useTransition = () => {
    const [value] = useState(() => new Animated.Value(0));
    const [offset] = useState(() => new Animated.Value(0));
    const scrollY = useRef(0);

    const device = useDevice();

    const height = device.screen.height / 4 - 30;

    const imageTranslateY = Animated.add(
        value.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, -height, -height * 2],
        }),
        offset,
    );

    const inputTranslateY = Animated.add(
        value.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -height],
            extrapolate: 'clamp',
        }),
        offset,
    );

    const start = useCallback((callBack: () => void) => {
        Animated.parallel([
            Animated.timing(value, {
                useNativeDriver: true,
                toValue: 2,
                duration: 300,
                easing: Easing.linear,
            }),
            Animated.timing(offset, {
                useNativeDriver: true,
                toValue: scrollY.current,
                duration: 150,
                easing: Easing.linear,
            }),
        ]).start(() => {
            setTimeout(() => {
                value.setValue(0);
                offset.setValue(0);
            }, 700);
        });
        setTimeout(() => {
            callBack();
        }, 0);
    }, []);

    return {
        styles: {
            input: { transform: [{ translateY: inputTranslateY }] },
            image: { transform: [{ translateY: imageTranslateY }] },
        },
        start,
        onScroll: (e: { nativeEvent: { contentOffset: { y: number } } }) => {
            scrollY.current = e.nativeEvent.contentOffset.y ?? 0;
        },
    };
};
