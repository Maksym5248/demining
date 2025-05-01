import React from 'react';

import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

import { Paragraph, Avatar, Image, Text, Touchable, Icon } from '~/core';
import { useTranslate } from '~/localization';
import { useTheme } from '~/styles';

import { useStyles } from './comment.style';
import { type ICommentViewProps } from './comment.type';
import { useImageStyles } from './useImageStyles';

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
                                    <Touchable key={index} style={style} onPress={() => item.openGallery(index)}>
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
                {!!item.text && (
                    <View style={s.textContainer}>
                        <Paragraph text={item.text} />
                    </View>
                )}
                <View style={s.actionsContainer}>
                    <View style={s.action}>
                        <Icon
                            name="like"
                            color={item.isLiked ? theme.colors.accent : theme.colors.background}
                            secondColor={theme.colors.accent}
                        />
                        <Text type="p5" text={item.likesCount} />
                    </View>
                    <View style={s.action}>
                        <Icon
                            name="like"
                            style={s.dislike}
                            color={item.isDisliked ? theme.colors.accent : theme.colors.background}
                            secondColor={theme.colors.accent}
                        />
                        <Text type="p5" text={item.dislikesCount} />
                    </View>
                    <View style={s.action}>
                        <Text
                            type="h5"
                            text={item.isReply ? t('replies', { value: item.replyCount }) : t('reply')}
                            color={theme.colors.accent}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
});
