import React, { useEffect, useRef } from 'react';

import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { v4 as uuid } from 'uuid';

import { useTooltip } from '~/hooks';

import { type ITooltipProps } from './tooltip.types';
import { Touchable } from '../touchable';

export const Tooltip = ({ children, text, style, delay = 0, ...props }: ITooltipProps) => {
    const tooltip = useTooltip();
    const aref = useAnimatedRef();

    const self = useRef<{
        id: string;
        timer: ReturnType<typeof setTimeout> | null;
    }>({
        id: uuid(),
        timer: null,
    }).current;

    const onPress = () => {
        if (delay) {
            self.timer = setTimeout(() => {
                tooltip.show({ id: self?.id, text }, aref);
            }, delay);
        } else if (!delay) {
            tooltip.show({ id: self?.id, text }, aref);
        }
    };

    useEffect(
        () => () => {
            tooltip.hide({ id: self?.id });
        },
        [],
    );

    return (
        <Animated.View {...props} ref={aref as unknown as React.LegacyRef<Animated.View>} style={style}>
            <Touchable onPress={onPress}>{children}</Touchable>
        </Animated.View>
    );
};
