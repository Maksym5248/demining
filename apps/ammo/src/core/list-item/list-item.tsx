import React from 'react';

import { isString } from 'lodash';
import { View } from 'react-native';

import { images } from '~/assets';
import { ThemeManager } from '~/styles';

import { useStyles } from './list-item.style';
import { type ICardProps } from './list-item.type';
import { Icon } from '../icon';
import { Image } from '../image';
import { Svg } from '../svg';
import { Text } from '../text';
import { Touchable } from '../touchable';

export const ListItem = ({ title, arrow, subTitle, type = 'default', uri, svg, children, styleInfo, ...props }: ICardProps) => {
    const s = useStyles();

    return (
        <Touchable {...props} type="rect" style={[s.container, props.style]}>
            {type === 'image' && <Image style={s.image} uri={uri} placeholder={images.placeholder} />}
            <View style={[s.info, styleInfo]}>
                {children}
                {!!svg && <Svg name={svg} style={s.svg} color={ThemeManager.theme.colors.accent} />}
                {isString(title) ? <Text type="h6" text={title} /> : title}
                {!!subTitle && <Text type="p5" text={subTitle} />}
            </View>
            {!!arrow && <Icon name="back" size={20} style={s.arrow} />}
        </Touchable>
    );
};
