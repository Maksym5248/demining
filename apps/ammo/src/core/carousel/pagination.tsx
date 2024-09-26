import React, { memo } from 'react';

import { View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

import { ThemeManager } from '~/styles';
import { type ISharedValue } from '~/types';

import { useStyles } from './pagination.styles';
import { type IPaginationProps } from './pagination.types';

interface DotProps {
    animatedIndex: ISharedValue;
    opacity: number;
    index: number;
    color: string;
    isScale: boolean;
    dotSize: number;
}

const Dot = ({ animatedIndex, opacity, index, color, isScale, dotSize }: DotProps) => {
    const additionalStyle = useAnimatedStyle(() => {
        const animatedOpacity = interpolate(
            animatedIndex.value,
            [index - 2, index - 1, index, index + 1, index + 2],
            [opacity, opacity, 1, opacity, opacity],
        );

        const style: { [key: string]: any } = {
            opacity: animatedOpacity,
            marginLeft: index === 0 ? 0 : 6,
            backgroundColor: color,
        };

        if (isScale) {
            const scale = interpolate(animatedIndex.value, [index - 2, index - 1, index, index + 1, index + 2], [0.8, 0.8, 1, 0.8, 0.8]);

            style.transform = [{ scale }];
        }

        return style;
    });

    return (
        <Animated.View
            style={[
                {
                    borderRadius: dotSize / 2,
                    height: dotSize,
                    width: dotSize,
                },
                additionalStyle,
            ]}
        />
    );
};

export const CarouselPagination = memo((props: IPaginationProps) => {
    const { number, style, animatedIndex, isScale = true, color = ThemeManager.theme.colors.primary, opacity = 0.1, dotSize = 10 } = props;

    const s = useStyles();

    const dots = Array(number).fill(1);

    return (
        <View style={[s.container, style]}>
            {dots.map((el, i) => (
                <Dot animatedIndex={animatedIndex} opacity={opacity} index={i} key={i} color={color} isScale={isScale} dotSize={dotSize} />
            ))}
        </View>
    );
});

CarouselPagination.displayName = 'CarouselPagination';
