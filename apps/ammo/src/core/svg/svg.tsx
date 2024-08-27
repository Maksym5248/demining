import React from 'react';

import _ from 'lodash';

import { svgImages } from '~/assets';
import { ThemeManager } from '~/styles';

import { useStyles } from './svg.styles';
import { type ISvgProps } from './svg.types';
import { Touchable } from '../touchable';

export const Svg = ({
    name,
    size,
    color = ThemeManager.theme.colors.primary,
    style,
    svgStyle,
    contentStyle,
    onPress,
    disabled,
    secondColor,
}: ISvgProps) => {
    const s = useStyles();

    const Component = svgImages[name];

    const props: { [key: string]: any } = {};

    if (size) {
        props.height = size;
        props.width = size;
    }

    if (secondColor) {
        props.secondColor = secondColor;
    }

    return (
        <Touchable
            contentStyle={[s.container, ...(_.isArray(contentStyle) ? contentStyle : [contentStyle])]}
            style={style}
            onPress={onPress}
            disabled={disabled}>
            <Component {...props} style={[s.svg, ...(_.isArray(svgStyle) ? svgStyle : [svgStyle])]} color={color} />
        </Touchable>
    );
};
