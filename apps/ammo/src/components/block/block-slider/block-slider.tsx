import React from 'react';

import { Paragraph } from '~/core';
import { useDevice, useStylesCommon, useTheme } from '~/styles';

import { type IBlockSliderProps } from './block-slider.type';
import { CarouselImage } from '../../carousel-image';
import { BlockView } from '../block-view';

export const BlockSlider = ({ description, data, label, hidden, require = true }: IBlockSliderProps) => {
    const styles = useStylesCommon();
    const theme = useTheme();
    const device = useDevice();

    if (hidden || (!require && !description && !data?.length)) {
        return null;
    }

    const itemWidth = device.window.width - theme.spacing.S * 2;

    return (
        <BlockView title={label}>
            <Paragraph text={description ?? '-'} style={styles.marginTopS} />
            {data.length !== 0 && <CarouselImage width={itemWidth} data={data} />}
        </BlockView>
    );
};
