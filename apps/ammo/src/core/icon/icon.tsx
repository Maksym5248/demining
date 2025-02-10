import React from 'react';

import _ from 'lodash';

import { svgIcons } from '~/assets';
import { ThemeManager } from '~/styles';

import { useStyles } from './icon.styles';
import { type IIconProps } from './icon.types';
import { Touchable } from '../touchable';

export const Icon = ({
    name,
    size,
    color = ThemeManager.theme.colors.primary,
    style,
    svgStyle,
    onPress,
    disabled,
    secondColor,
}: IIconProps) => {
    const s = useStyles();

    const Component = svgIcons[name];

    const props: { [key: string]: any } = {};

    if (size) {
        props.height = size;
        props.width = size;
    }

    if (secondColor) {
        props.secondColor = secondColor;
    }

    return (
        <Touchable style={[s.container, style]} onPress={onPress} disabled={disabled}>
            <Component {...props} style={[s.svg, ...(_.isArray(svgStyle) ? svgStyle : [svgStyle])]} color={color} />
        </Touchable>
    );
};
