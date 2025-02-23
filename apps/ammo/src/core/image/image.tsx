import React, { useState } from 'react';

import _ from 'lodash';
import { View, Animated, ActivityIndicator, Easing, Image as Img, type NativeSyntheticEvent, type ImageLoadEventData } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { Logger, useAsyncEffect } from 'shared-my-client';

import { useVar } from '~/hooks';
import { ImageChache } from '~/services';
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
    const [localUri, setLocalUri] = useState<string | undefined>();

    const _onLoad = (e: NativeSyntheticEvent<ImageLoadEventData>) => {
        console.log('_onLoad');

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

    const onError = (e?: unknown) => {
        Logger.error('Component Image:', {
            e,
            uri,
            localUri,
        });
        setLoading(false);
    };

    useAsyncEffect(async () => {
        if (!uri) return;

        try {
            const fileExists = await ImageChache.exists(uri);

            if (!fileExists) {
                await ImageChache.download(uri);
            }

            setLocalUri(ImageChache.getLocalPath(uri));
        } catch (e) {
            onError(e);
        }
    }, [uri]);

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
            {(!!localUri || !!source) && (
                <AnimatedImage
                    source={source || { uri: localUri ?? undefined }}
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
