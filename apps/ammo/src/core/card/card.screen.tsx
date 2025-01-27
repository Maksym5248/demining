import React from 'react';

import { useStyles } from './card.style';
import { type ICardProps } from './card.type';
import { Text } from '../text';
import { Touchable } from '../touchable';

export const Card = ({ title, children, ...props }: ICardProps) => {
    const s = useStyles();

    return (
        <Touchable {...props} style={[s.container, props.style]}>
            {children}
            <Text type="h6" text={title} />
        </Touchable>
    );
};
