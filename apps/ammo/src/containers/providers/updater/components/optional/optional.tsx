import React, { useState, useEffect, memo, useCallback } from 'react';

import { View } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS, interpolate } from 'react-native-reanimated';
import { delay } from 'shared-my-client';

import { Text, Button, Loading, Icon } from '~/core';
import { useTranslate } from '~/localization';
import { Message, Updater } from '~/services';
import { type IUpdaterState } from '~/services/ui/updater';
import { useDevice, useTheme } from '~/styles';

import { getContentHeight, useStyles } from './optional.styles';

interface IOptionalProps extends Omit<IUpdaterState, 'type'> {}

enum STATUS {
    IDLE = 'idle',
    LOADING = 'loading',
    ERROR = 'error',
    SUCCESS = 'success',
}

const Component = ({ isVisible, title, text, onLoad }: IOptionalProps) => {
    const s = useStyles();
    const device = useDevice();
    const theme = useTheme();
    const [isRendering, setRendering] = useState(false);
    const [status, setStatus] = useState<STATUS>(STATUS.IDLE);
    const t = useTranslate('containers.updater.optional');

    const animated = useSharedValue(1);

    useEffect(() => {
        if (isVisible) {
            setRendering(true);
            requestAnimationFrame(() => {
                animated.value = withTiming(1, { duration: 200 });
            });
        } else {
            const onEndAnimation = () => setRendering(false);
            animated.value = withTiming(0, { duration: 200 }, () => runOnJS(onEndAnimation)());
        }
    }, [isVisible]);

    const onPressLoad = useCallback(async () => {
        try {
            setStatus(STATUS.LOADING);
            await onLoad();

            setStatus(STATUS.SUCCESS);
            await delay(2000);
        } catch (error) {
            Message.error(t('error'));
            setStatus(STATUS.ERROR);
        }

        Updater.hide();
    }, [onLoad]);

    const onPressLater = useCallback(() => {
        Updater.hide();
    }, []);

    const deviceHeight = getContentHeight(device);
    const containerStyle = useAnimatedStyle(() => ({
        opacity: animated.value,
        transform: [{ translateY: interpolate(animated.value, [0, 1], [deviceHeight, 0]) }],
    }));

    const isLoading = status === STATUS.LOADING;
    const isIdle = status === STATUS.IDLE;
    const isSuccess = status === STATUS.SUCCESS;

    return (
        isRendering && (
            <Animated.View style={[s.container, containerStyle]}>
                <View style={s.content}>
                    <View style={s.textContainer}>
                        <Text type="h5" text={title ?? t('title')} />
                        <Text type="p4" text={text} />
                    </View>
                    <View style={s.buttons}>
                        {isLoading && <Loading isVisible />}
                        {isSuccess && <Icon name="success" size={50} color={theme.colors.success} />}
                        {isIdle && (
                            <>
                                <Button.Base title={t('later')} style={s.buttonLater} onPress={onPressLater} />
                                <Button.Base title={t('update')} style={s.button} onPress={onPressLoad} />
                            </>
                        )}
                    </View>
                </View>
            </Animated.View>
        )
    );
};

export const Optional = memo(Component);
