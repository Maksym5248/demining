import React from 'react';

import { observer } from 'mobx-react-lite';

import { Paragraph, CarouselImage, Block } from '~/core';
import { useDevice, useStylesCommon, useTheme } from '~/styles';

import { type ISectionCarouselProps } from './section-carousel.type';

export const SectionCarousel = observer(({ item, title }: ISectionCarouselProps) => {
    const styles = useStylesCommon();
    const theme = useTheme();
    const device = useDevice();

    const itemWidth = device.window.width - theme.spacing.S * 2;

    if (!item?.isVisible) {
        return null;
    }

    return (
        <Block title={title}>
            <Paragraph text={item?.description ?? '-'} style={styles.marginTopS} />
            {item?.data.length !== 0 && <CarouselImage width={itemWidth} data={item?.data} />}
        </Block>
    );
});
