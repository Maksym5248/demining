import React from 'react';

import { View } from 'react-native';

import { Text } from '~/core';
import { useDevice, useStylesCommon, useTheme } from '~/styles';

import { type IBlockSliderProps } from './block-slider.type';
import { CarouselImage } from '../../carousel-image';

export const BlockSlider = ({ description, data, label }: IBlockSliderProps) => {
    const styles = useStylesCommon();
    const theme = useTheme();
    const device = useDevice();

    const itemWidth = device.window.width - theme.spacing.S * 4;

    return (
        <View style={styles.block}>
            <Text type="h3" style={styles.label} text={label} />
            <Text text={description ?? '-'} style={styles.marginVerticalS} />
            <CarouselImage width={itemWidth} data={data} />
        </View>
    );
};
