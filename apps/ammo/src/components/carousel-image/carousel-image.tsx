import React, { useCallback } from 'react';

import { images } from '~/assets';
import { MODALS } from '~/constants';
import { Carousel, type IRenderItemParams, type IRenderFooterParams, Image, Touchable } from '~/core';
import { Modal } from '~/services';
import { useStylesCommon, useTheme } from '~/styles';
import { type ISlide } from '~/types';

import { useStyles } from './carousel-image.style';
import { type ICarouselImageProps } from './carousel-image.type';

export const CarouselImage = ({ data, width }: ICarouselImageProps) => {
    const styles = useStylesCommon();
    const theme = useTheme();
    const s = useStyles();
    const slides = data.length ? data : [{ uri: undefined }];

    const onOpenGallery = useCallback((index: number) => {
        if (data.length === 0) return;
        Modal.show(MODALS.GALLERY, { images: data, index });
    }, []);

    const renderItem = useCallback(
        ({ item, index }: IRenderItemParams<ISlide>) => (
            <Touchable type="rect" onPress={() => onOpenGallery(index)}>
                <Image style={s.image} uri={item.uri} placeholder={images.placeholder} />
            </Touchable>
        ),
        [],
    );

    const renderFooter = useCallback(
        ({ data, animatedIndex }: IRenderFooterParams) => {
            return (
                <Carousel.Pagination
                    style={s.pagination}
                    animatedIndex={animatedIndex}
                    number={data.length}
                    color={theme.colors.accent}
                    dotSize={5}
                    opacity={0.3}
                />
            );
        },
        [theme, s],
    );

    return (
        <Carousel.Container
            width={width}
            itemWidth={width}
            data={slides.length ? slides : [{ uri: undefined }]}
            renderItem={renderItem}
            renderFooter={slides.length > 1 ? renderFooter : undefined}
            isFooterInsideTouchable
            style={styles.hidden}
        />
    );
};
