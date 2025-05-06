import React, { useCallback, useEffect } from 'react';

import { useTheme } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { View } from 'react-native';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import { Loading, Text } from '~/core';
import { useTranslate } from '~/localization';
import { useStylesCommon } from '~/styles';
import { measureSize } from '~/utils';

import { useStyles } from './comments-preview.style';
import { type ICommentsPreviewProps } from './comments-preview.type';
import { Auth } from '../auth';

export const CommentsPreview = observer(({ item, onMeasure }: ICommentsPreviewProps) => {
    const t = useTranslate('components.comments-preview');
    const styles = useStylesCommon();
    const theme = useTheme();
    const s = useStyles();
    const ref = useAnimatedRef();

    const measureCommentPreview = useCallback(async () => {
        const size = await measureSize(ref);
        onMeasure?.(size);
    }, []);

    useEffect(() => {
        item?.load.run();
    }, [item]);

    return (
        <Animated.View style={s.container} onLayout={measureCommentPreview} ref={ref}>
            <Text type="h3" style={styles.label} text={t('title')} color={theme.colors.text} />
            <Auth description={t('authComments')}>
                {!item?.isComments && !item?.isLoading && (
                    <View style={s.containerNoComments}>
                        <Text type="p4" text={t('noComments')} />
                    </View>
                )}
                {!!item?.isLoading && (
                    <View style={s.containerNoComments}>
                        <Loading isVisible />
                    </View>
                )}
            </Auth>
        </Animated.View>
    );
});
