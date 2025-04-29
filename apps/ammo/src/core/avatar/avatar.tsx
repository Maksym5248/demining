import React from 'react';

import { useTheme } from '~/styles';

import { useStyles, getStyleForSize } from './avatar.styles';
import { type IAvatarProps } from './avatar.types';
import { Image } from '../image';
import { Svg } from '../svg';
import { Touchable } from '../touchable';

export const Avatar = ({ onPress, uri, style, size = 48 }: IAvatarProps) => {
    const s = useStyles();
    const theme = useTheme();
    const sizeStyle = getStyleForSize(size);

    return (
        <Touchable onPress={onPress} style={[s.container, sizeStyle, style]}>
            {!!uri && <Image style={sizeStyle} uri={uri} />}
            {!uri && <Svg size={size} name="avatar" color={theme.colors.accent} />}
        </Touchable>
    );
};

Avatar.displayName = 'Avatar';
