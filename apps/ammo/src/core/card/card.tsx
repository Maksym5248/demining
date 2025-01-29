import React from 'react';

import { View } from 'react-native';

import { images } from '~/assets';
import { ThemeManager } from '~/styles';

import { useStyles } from './card.style';
import { type ICardProps } from './card.type';
import { Image } from '../image';
import { Svg } from '../svg';
import { Text } from '../text';
import { Touchable } from '../touchable';

export const Card = ({ title, type = 'default', uri, svg, ...props }: ICardProps) => {
    const s = useStyles();

    return (
        <Touchable {...props} style={[s.container, props.style]} contentStyle={s.content}>
            {type === 'image' && <Image style={s.image} uri={uri} placeholder={images.placeholder} />}
            <View style={s.info}>
                {!!svg && <Svg name={svg} style={s.svg} color={ThemeManager.theme.colors.accent} />}
                <Text type="h6" text={title} />
            </View>
        </Touchable>
    );
};
