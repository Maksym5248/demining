import { memo, useState } from 'react';

import { Animated } from 'react-native';
import BootSplash from 'react-native-bootsplash';

import { images } from '~/assets';
import { useDevice, useTheme } from '~/styles';

type Props = {
    onAnimationEnd: () => void;
    isReady: boolean;
};

export const Splash = memo(({ onAnimationEnd, isReady }: Props) => {
    const [value] = useState(() => new Animated.Value(0));
    const device = useDevice();
    const theme = useTheme();

    const { container, logo } = BootSplash.useHideAnimation({
        manifest: images.logoManifest,
        logo: images.logo,
        ready: isReady,
        statusBarTranslucent: true,
        navigationBarTranslucent: false,

        animate: () => {
            Animated.timing(value, {
                useNativeDriver: true,
                toValue: 1,
                duration: 2600,
            }).start(() => {
                onAnimationEnd();
            });
        },
    });

    const opacity = value.interpolate({
        inputRange: [0.5, 1],
        outputRange: [1, 0],
    });

    const translateY = value.interpolate({
        inputRange: [0, 0.5],
        outputRange: [
            0,
            -(device.window.height * 0.5 - 150 - (theme.element.header.height as number) + (device.isAndroid ? device.inset.top : -2)),
        ],
        extrapolate: 'clamp',
    });

    const scale = value.interpolate({
        inputRange: [0, 0.5],
        outputRange: [1, 0.75],
        extrapolate: 'clamp',
    });

    return (
        <Animated.View {...container} style={[container.style, { opacity }]}>
            <Animated.Image {...logo} style={{ transform: [{ translateY }, { scale }] }} />
        </Animated.View>
    );
});

Splash.displayName = 'Splash';
