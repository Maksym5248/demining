import React from 'react';

import { View } from 'react-native';

import { useTheme } from '~/styles';

import { useStyles, getStyleForSize } from './avatar.styles';
import { type IAvatarProps } from './avatar.types';
import { Image } from '../image';
import { Svg } from '../svg';

export const Avatar = ({ onPress, uri, style, size = 48 }: IAvatarProps) => {
    const s = useStyles();
    const theme = useTheme();
    const sizeStyle = getStyleForSize(size);

    return (
        <View style={[s.container, sizeStyle, style]}>
            {!!uri && <Image onPress={onPress} style={s.image} uri={uri} />}
            {!uri && <Svg onPress={onPress} size={size - 20} name="avatar" color={theme.colors.accent} />}
        </View>
    );
};

Avatar.displayName = 'Avatar';
