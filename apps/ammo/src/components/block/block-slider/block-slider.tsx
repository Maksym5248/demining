import React, { useCallback } from 'react';

import { View } from 'react-native';

import { images } from '~/assets';
import { Carousel, CarouselPagination, type IRenderItemParams, type IRenderFooterParams, Image, Text } from '~/core';
import { useDevice, useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './block-slider.style';
import { type IBlockSliderProps, type ISlide } from './block-slider.type';

export const BlockSlider = ({ description, slides, label }: IBlockSliderProps) => {
    const styles = useStylesCommon();
    const theme = useTheme();
    const device = useDevice();
    const s = useStyles();

    const renderItem = useCallback(
        ({ item }: IRenderItemParams<ISlide>) => <Image style={s.image} uri={item.uri} placeholder={images.placeholder} />,
        [],
    );

    const renderFooter = useCallback(
        ({ data, animatedIndex }: IRenderFooterParams) => {
            return (
                <CarouselPagination
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

    const itemWidth = device.window.width - theme.spacing.S * 4;

    return (
        <View style={styles.block}>
            <Text type="h3" style={styles.label} text={label} />
            <Text text={description ?? '-'} style={styles.marginVerticalS} />
            <Carousel
                width={itemWidth}
                itemWidth={itemWidth}
                data={slides.length ? slides : [{ uri: undefined }]}
                renderItem={renderItem}
                renderFooter={slides.length > 1 ? renderFooter : undefined}
                isFooterInsideTouchable
                style={styles.hidden}
            />
        </View>
    );
};
