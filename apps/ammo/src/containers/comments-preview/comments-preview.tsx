import React from 'react';

import { useTheme } from '@react-navigation/native';
import { View } from 'react-native';

import { Text } from '~/core';
import { useTranslate } from '~/localization';
import { useStylesCommon } from '~/styles';

import { useStyles } from './comments-preview.style';
import { type ICommentsPreviewProps } from './comments-preview.type';
import { Auth } from '../auth';

export const CommentsPreview = ({ isComments }: ICommentsPreviewProps) => {
    const t = useTranslate('components.comments-preview');
    const styles = useStylesCommon();
    const theme = useTheme();
    const s = useStyles();

    return (
        <View style={s.container}>
            <Text type="h3" style={styles.label} text={t('title')} color={theme.colors.text} />
            <Auth description={t('authComments')}>
                {!isComments && (
                    <View style={s.containerNoComments}>
                        <Text type="p4" text={t('noComments')} />
                    </View>
                )}
            </Auth>
        </View>
    );
};
