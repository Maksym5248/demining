import React, { useRef, useState, memo, useEffect } from 'react';

import Animated, { Easing, useSharedValue, withTiming, useAnimatedStyle, interpolate } from 'react-native-reanimated';

import { useStyles } from './label.styles';
import { type ILabelProps } from './label.types';
import { Text } from '../../text';

const Component = ({ text, style, isSmall, paddingLeft }: ILabelProps) => {
    const s = useStyles();
    const animated = useSharedValue(isSmall ? 1 : 0);

    const self = useRef({ didMount: false }).current;
    const [width, setWidth] = useState(0);

    const scale = 0.77;
    const translateX = width ? (width - width * scale) / 2 : 0;

    useEffect(() => {
        if (self.didMount) {
            animated.value = withTiming(isSmall ? 1 : 0, {
                duration: 200,
                easing: Easing.linear,
            });
        }

        self.didMount = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSmall]);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: interpolate(animated.value, [0, 1], [paddingLeft?.value ?? 0, -translateX]),
            },
            {
                translateY: interpolate(animated.value, [0, 1], [0, -25]),
            },
            {
                scale: interpolate(animated.value, [0, 1], [1, scale]),
            },
        ],
    }));

    const onLayout = ({ nativeEvent }: { nativeEvent: { layout: { width: number } } }) => {
        if (width !== nativeEvent.layout.width) {
            setWidth(nativeEvent.layout.width);
        }
    };

    return (
        <Animated.View onLayout={onLayout} style={[s.container, containerStyle]}>
            {!!width && <Text type="p1" text={text} style={[s.label, style]} />}
        </Animated.View>
    );
};

export const Label = memo(Component);
