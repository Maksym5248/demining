import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { images } from '~/assets';
import { Carousel, CarouselPagination, Header, type IRenderItemParams, type IRenderFooterParams, Image } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useDevice, useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './explosive-details.style';
import { type IExplosiveDetailsScreenProps } from './explosive-details.types';
import { explosiveDetailsVM, type ISlide, type IExplosiveDetailsVM } from './explosive-details.vm';

export const ExplosiveDetailsScreen = observer(({ route }: IExplosiveDetailsScreenProps) => {
    const theme = useTheme();
    const device = useDevice();
    const s = useStyles();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-details');

    const vm = useViewModel<IExplosiveDetailsVM>(explosiveDetailsVM, route?.params);

    const renderItem = useCallback(({ item }: IRenderItemParams<ISlide>) => <Image style={s.image} uri={item.uri} />, []);

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

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="back" />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Carousel
                    width={device.window.width}
                    itemWidth={device.window.width}
                    data={vm.slides.length ? vm.slides : [images.placeholder]}
                    renderItem={renderItem}
                    renderFooter={vm.slides.length > 1 ? renderFooter : undefined}
                    isFooterInsideTouchable
                />
            </ScrollView>
        </View>
    );
});
