import React from 'react';

import { observer } from 'mobx-react-lite';
import { TextInput } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { Badge, Icon, Loading } from '~/core';
import { useTranslate } from '~/localization';
import { useTheme } from '~/styles';

import { useStyles } from './comment-input.style';
import { type ICommentInputProps } from './comment-input.type';

export const CommentInput = observer(({ item, style, onLayout }: ICommentInputProps) => {
    const s = useStyles();
    const t = useTranslate('components.comment-input');
    const theme = useTheme();

    return (
        !!item.isVisible && (
            <Animated.View style={[s.container, style]} onLayout={onLayout}>
                <Badge count={item.countSelectedImages} color={theme.colors.accent} style={[s.badge, s.buttons]}>
                    <Icon
                        name={item.isSelectedImages ? 'close' : 'gallery-empty'}
                        color={theme.colors.accent}
                        onPress={() => (item.isSelectedImages ? item.removeImages() : item.openGallery.run())}
                    />
                </Badge>
                <TextInput
                    placeholder={t('placeholder')}
                    placeholderTextColor={theme.colors.inertDark}
                    numberOfLines={4}
                    style={s.input}
                    returnKeyLabel="return"
                    value={item.value}
                    onChangeText={text => item.onChangeValue(text)}
                    onFocus={() => item.setFocused(true)}
                    onBlur={() => item.setFocused(false)}
                    multiline
                />
                {!item.isLoading && (
                    <Icon
                        name="send"
                        color={item.isDisabled ? theme.colors.inert : theme.colors.accent}
                        onPress={() => item.submit.run()}
                        style={s.buttons}
                    />
                )}
                {!!item.isLoading && <Loading isVisible size="small" color={theme.colors.accent} style={[s.buttons, s.loading]} />}
            </Animated.View>
        )
    );
});
