import React, { useState } from 'react';

import _ from 'lodash';
import { View, Animated, ActivityIndicator, Easing, Image as Img, type NativeSyntheticEvent, type ImageLoadEventData } from 'react-native';
import Reanimated from 'react-native-reanimated';

import { useVar } from '~/hooks';
import { useTheme } from '~/styles';

import { useStyles } from './image.styles';
import { type IImageProps } from './image.types';

const AnimatedImage = Animated.createAnimatedComponent(Img);

export function Image({
    uri,
    source,
    style,
    imageStyle,
    placeholderStyle,
    loadingStyle,
    placeholder,
    resizeMode = 'cover',
    onLoad,
    isAnimated,
    ...props
}: IImageProps) {
    const s = useStyles();
    const theme = useTheme();

    const animatedValue = useVar<Animated.Value>(new Animated.Value(0));

    const [isVisiblePlaceholder, setVisiblePlaceholder] = useState(true);
    const [isLoading, setLoading] = useState(!!uri);

    const _onLoad = (e: NativeSyntheticEvent<ImageLoadEventData>) => {
        e.persist();

        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => {
            setLoading(false);
            setVisiblePlaceholder(false);
            onLoad?.(e);
        });
    };

    const onError = () => {
        setLoading(false);
    };

    const Container = isAnimated ? Reanimated.View : View;

    return (
        <Container style={[s.container, ...(_.isArray(style) ? style : [style])]}>
            {!!placeholder && !!isVisiblePlaceholder && !isLoading && (
                <Img source={placeholder} style={[s.absolute, placeholderStyle]} resizeMode={resizeMode} {...props} />
            )}
            {isLoading && (
                <View style={[s.absolute, loadingStyle]}>
                    <ActivityIndicator size="small" color={theme.colors.accent} />
                </View>
            )}
            {(!!uri || !!source) && (
                <AnimatedImage
                    source={source || { uri: uri ?? undefined }}
                    style={[s.image, { opacity: animatedValue }, imageStyle]}
                    resizeMode={resizeMode}
                    onLoad={_onLoad}
                    onError={onError}
                    {...props}
                />
            )}
        </Container>
    );
}
