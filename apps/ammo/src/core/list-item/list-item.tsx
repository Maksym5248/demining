import React from 'react';

import { View } from 'react-native';

import { images } from '~/assets';
import { ThemeManager } from '~/styles';

import { useStyles } from './list-item.style';
import { type ICardProps } from './list-item.type';
import { Image } from '../image';
import { Svg } from '../svg';
import { Text } from '../text';
import { Touchable } from '../touchable';

export const ListItem = ({ title, subTitle, type = 'default', uri, svg, children, styleInfo, ...props }: ICardProps) => {
    const s = useStyles();

    return (
        <View {...props} style={[s.container, props.style]}>
            {type === 'image' && <Image style={s.image} uri={uri} placeholder={images.placeholder} />}
            <View style={[s.info, styleInfo]}>
                {children}
                {!!svg && <Svg name={svg} style={s.svg} color={ThemeManager.theme.colors.accent} />}
                <Text type="h6" text={title} />
                {!!subTitle && <Text type="p5" text={subTitle} />}
            </View>
            <Touchable {...props} type="rect" style={s.touchable} />
        </View>
    );
};
