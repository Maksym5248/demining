import React from 'react';

import { ThemeManager } from '~/styles';

import { useStyles } from './card.style';
import { type ICardProps } from './card.type';
import { Svg } from '../svg';
import { Text } from '../text';
import { Touchable } from '../touchable';

export const Card = ({ title, svg, ...props }: ICardProps) => {
    const s = useStyles();

    return (
        <Touchable {...props} style={[s.container, props.style]} contentStyle={s.content}>
            {!!svg && <Svg name={svg} style={s.svg} color={ThemeManager.theme.colors.accent} />}
            <Text type="h6" text={title} style={svg ? s.titleSvg : undefined} />
        </Touchable>
    );
};
