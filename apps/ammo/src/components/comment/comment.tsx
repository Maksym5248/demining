import React, { useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

import { Paragraph, Avatar, Image, Text, Touchable } from '~/core';
import { useTranslate } from '~/localization';
import { useDevice, useTheme } from '~/styles';

import { useStyles } from './comment.style';
import { type ICommentViewProps } from './comment.type';

const getListWidth = (count: number, width: number, gap: number) => {
    const w = width;
    const gap1 = gap / 2;
    const gap2 = (gap * 2) / 3;

    return [
        [w],
        [w / 2 - gap1, w / 2 - gap1],
        [w / 3 - gap2, w / 3 - gap2, w / 3 - gap2],
        [w / 2 - gap1, w / 2 - gap1, w / 2 - gap1, w / 2 - gap1],
        [w / 3 - gap2, w / 3 - gap2, w / 3 - gap2, w / 2 - gap1, w / 2 - gap1],
        [w / 3 - gap2, w / 3 - gap2, w / 3 - gap2, w / 3 - gap2, w / 3 - gap2, w / 3 - gap2],
    ][count - 1];
};

const useImageStyles = (length: number) => {
    const theme = useTheme();
    const device = useDevice();

    const LEFT_GAP = 32 + theme.spacing.XS * 5;
    const maxImageWidth = device.window.width - LEFT_GAP;
    const count = length >= 6 ? 6 : length;
    const listWidth = getListWidth(count, maxImageWidth, theme.spacing.XXS);

    return useMemo(
        () => ({
            get: (index: number) => {
                const width = listWidth[index];

                return {
                    width,
                };
            },
        }),
        [count, device.window.width, listWidth],
    );
};

export const CommentView = observer(({ item, style }: ICommentViewProps) => {
    const s = useStyles();
    const t = useTranslate('components.comment');
    const theme = useTheme();

    const imageLayouts = useImageStyles(item.imageUris?.length);

    return (
        <View style={[s.container, style]}>
            <Avatar uri={item.photoUri} size={48} />
            <View style={s.content}>
                {!!item.title && (
                    <View style={s.titleConainer}>
                        <Text type="h5" numberOfLines={1} text={item.title} />
                    </View>
                )}
                {item.imageUris.length > 0 && (
                    <View style={s.imageContainer}>
                        {item.imageUris
                            .map((uri, index) => {
                                const style = imageLayouts.get(index);
                                const isLastVisible = index === 5;
                                return (
                                    <Touchable key={index} style={style}>
                                        <Image source={{ uri }} style={[s.image, style]} resizeMode="contain" />
                                        {!!isLastVisible && (
                                            <View style={[style, s.imageShadow]}>
                                                <Text type="p5" numberOfLines={1} text={t('viewAll')} color={theme.colors.white} />
                                            </View>
                                        )}
                                    </Touchable>
                                );
                            })
                            .slice(0, 6)}
                    </View>
                )}
                {!!item.text && <Paragraph text={item.text} />}
                <View style={s.actionsContainer}>
                    <Text type="p5" numberOfLines={1} text={t('viewAll')} color={theme.colors.white} />
                </View>
            </View>
        </View>
    );
});
