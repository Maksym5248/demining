import React from 'react';

import { View } from 'react-native';

import { images } from '~/assets';
import { ThemeManager } from '~/styles';

import { useStyles } from './card.style';
import { type ICardProps } from './card.type';
import { Image } from '../image';
import { Svg } from '../svg';
import { Tag } from '../tag';
import { Text } from '../text';
import { Touchable } from '../touchable';

export const Card = ({ title, subTitle, type = 'default', tags, uri, svg, children, styleInfo, ...props }: ICardProps) => {
    const s = useStyles();

    return (
        <Touchable {...props} style={[s.container, props.style]} contentStyle={s.content}>
            {type === 'image' && <Image style={s.image} uri={uri} placeholder={images.placeholder} />}
            {!!tags?.length && <View style={s.tags}>{tags?.map(tag => <Tag text={tag} key={tag} />)}</View>}
            <View style={[s.info, styleInfo]}>
                {children}
                {!!svg && <Svg name={svg} style={s.svg} color={ThemeManager.theme.colors.accent} />}
                <Text type="h6" text={title} />
                {!!subTitle && <Text type="p5" text={subTitle} />}
            </View>
        </Touchable>
    );
};
