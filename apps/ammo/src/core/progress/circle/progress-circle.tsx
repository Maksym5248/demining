import React, { memo, useEffect } from 'react';

import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { ThemeManager } from '~/styles';

import { type ProgressCircularProps } from './progress-circle.type';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ProgressCircular = memo(
    ({
        style,
        size = 24,
        strokeWidth = 3,
        progress,
        color = ThemeManager.theme.colors.accent,
        backgroundColor = ThemeManager.theme.colors.inert,
    }: ProgressCircularProps) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const animatedProgress = useSharedValue(0);

        useEffect(() => {
            animatedProgress.value = withTiming(progress, {
                duration: 100,
                easing: Easing.out(Easing.ease),
            });
        }, [progress]);

        const animatedProps = useAnimatedProps(() => {
            const strokeDashoffset = circumference * (1 - animatedProgress.value);
            return {
                strokeDashoffset,
            };
        });

        return (
            <View style={[style, { width: size, height: size }]}>
                <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <Circle cx={size / 2} cy={size / 2} r={radius} stroke={backgroundColor} strokeWidth={strokeWidth} fill="none" />
                    <AnimatedCircle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={circumference}
                        animatedProps={animatedProps}
                        transform={`rotate(-90 ${size / 2} ${size / 2})`} // Rotate the circle to start from the top
                    />
                </Svg>
            </View>
        );
    },
);

ProgressCircular.displayName = 'ProgressCircular';
