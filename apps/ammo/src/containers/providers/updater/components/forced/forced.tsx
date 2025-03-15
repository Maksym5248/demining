import React, { useState, useEffect, useCallback, memo } from 'react';

import { View } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS, interpolate } from 'react-native-reanimated';
import { delay } from 'shared-my-client';

import { Text, Button, Loading, Icon, Header } from '~/core';
import { useTranslate } from '~/localization';
import { Message, Updater } from '~/services';
import { type IUpdaterState } from '~/services/ui/updater';
import { useDevice, useTheme } from '~/styles';
import { externalLink } from '~/utils';

import { useStyles } from './forced.styles';

interface IOptionalProps extends Omit<IUpdaterState, 'type'> {}

enum STATUS {
    IDLE = 'idle',
    LOADING = 'loading',
    ERROR = 'error',
    SUCCESS = 'success',
}

const Component = ({ id, link, isVisible, title, text, onLoad }: IOptionalProps) => {
    const s = useStyles();
    const theme = useTheme();
    const device = useDevice();
    const [isRendering, setRendering] = useState(false);
    const [status, setStatus] = useState<STATUS>(STATUS.IDLE);
    const t = useTranslate('containers.updater');

    const animated = useSharedValue(1);

    const hide = useCallback(() => {
        Updater.hide(id);
        setTimeout(() => setStatus(STATUS.IDLE), 0);
    }, []);

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
            await onLoad?.();

            setStatus(STATUS.SUCCESS);
            await delay(2000);
        } catch (error) {
            Message.error(t('error'));
            setStatus(STATUS.ERROR);
        }

        hide();
    }, [onLoad]);

    const onPressDownload = useCallback(async () => {
        !!link && externalLink.open(link);
    }, [onLoad]);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: animated.value,
        transform: [{ translateY: interpolate(animated.value, [0, 1], [0, 0]) }],
    }));

    const isLoading = status === STATUS.LOADING;
    const isIdle = status === STATUS.IDLE;
    const isSuccess = status === STATUS.SUCCESS;

    const ICON_SIZE = device.window.width * 0.7;

    return (
        isRendering && (
            <Animated.View style={[s.container, containerStyle]}>
                <Header title={title ?? t('title')} backButton="none" color={theme.colors.white} />
                <View style={s.content}>
                    {isSuccess && <Icon name="success" size={ICON_SIZE} color={theme.colors.success} />}
                    {!isSuccess && <Icon name="cloud-update" size={ICON_SIZE} color={theme.colors.accent} />}
                    <Text type="p4" text={text} style={s.text} />
                    <View style={s.buttons}>
                        {isLoading && <Loading isVisible />}
                        {isIdle && (
                            <Button.Base
                                title={link ? t('download') : t('update')}
                                style={s.button}
                                onPress={link ? onPressDownload : onPressLoad}
                            />
                        )}
                    </View>
                </View>
            </Animated.View>
        )
    );
};

export const Forced = memo(Component);
