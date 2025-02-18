import { useCallback, useState } from 'react';

import { Animated } from 'react-native';

import { useDevice } from '~/styles';

export const useTransition = () => {
    const [value] = useState(() => new Animated.Value(0));
    const device = useDevice();

    const height = device.screen.height / 4 - 30;

    const imageTranslateY = value.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [0, -height, -height * 2],
    });

    const inputTranslateY = value.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -height],
        extrapolate: 'clamp',
    });

    const start = useCallback((callBack: () => void) => {
        Animated.timing(value, {
            useNativeDriver: true,
            toValue: 2,
            duration: 300,
        }).start(() => {
            setTimeout(() => {
                value.setValue(0);
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
    };
};
