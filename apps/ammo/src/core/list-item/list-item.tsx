import React from 'react';

import { isString } from 'lodash';
import { View } from 'react-native';

import { images } from '~/assets';
import { ThemeManager, useTheme } from '~/styles';

import { useStyles } from './list-item.style';
import { type ICardProps } from './list-item.type';
import { Icon } from '../icon';
import { Image } from '../image';
import { Svg } from '../svg';
import { Text } from '../text';
import { Touchable } from '../touchable';

export const ListItem = ({
    title,
    arrow,
    subTitle,
    type = 'default',
    state = 'default',
    uri,
    svg,
    children,
    styleInfo,
    ...props
}: ICardProps) => {
    const s = useStyles();
    const theme = useTheme();

    const isActive = state === 'active';

    return (
        <Touchable {...props} type="rect" style={[s.container, props.style, isActive && s.containerActive]}>
            {type === 'image' && <Image style={s.image} uri={uri} placeholder={images.placeholder} />}
            <View style={[s.info, styleInfo]}>
                {children}
                {!!svg && <Svg name={svg} style={s.svg} color={ThemeManager.theme.colors.accent} />}
                {isString(title) ? (
                    <Text type="h6" text={title} color={isActive ? theme.colors.backgroundSecondary : theme.colors.text} />
                ) : (
                    title
                )}
                {!!subTitle && <Text type="p5" text={subTitle} />}
            </View>
            {!!arrow && <Icon name="back" size={20} style={s.arrow} />}
        </Touchable>
    );
};
