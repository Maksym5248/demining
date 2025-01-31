import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { images } from '~/assets';
import { Block, type ISlide } from '~/components';
import { SCREENS } from '~/constants';
import { Carousel, CarouselPagination, Header, type IRenderItemParams, type IRenderFooterParams, Image, Text, Touchable } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { Navigation } from '~/services';
import { ThemeManager, useDevice, useStylesCommon, useTheme } from '~/styles';
import { viewSize } from '~/utils';

import { useStyles } from './explosive-device-details.style';
import { type IExplosiveDeviceDetailsScreenProps } from './explosive-device-details.types';
import { createVM, type IExplosiveObjectDetailsVM } from './explosive-device-details.vm';

export const ExplosiveDeviceDetailsScreen = observer(({ route }: IExplosiveDeviceDetailsScreenProps) => {
    const theme = useTheme();
    const device = useDevice();
    const s = useStyles();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-device-details');

    const vm = useViewModel<IExplosiveObjectDetailsVM>(createVM(route?.params?.id), route?.params);

    const onOpenExplosive = useCallback((id: string) => {
        Navigation.push(SCREENS.EXPLOSIVE_DETAILS, { id });
    }, []);

    const renderItem = useCallback(
        ({ item }: IRenderItemParams<ISlide>) => <Image style={s.image} uri={item?.uri} placeholder={images.placeholder} />,
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

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="back" />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Carousel
                    width={device.window.width}
                    itemWidth={device.window.width}
                    data={vm.slides.length ? vm.slides : [{ uri: undefined }]}
                    renderItem={renderItem}
                    renderFooter={vm.slides.length > 1 ? renderFooter : undefined}
                    isFooterInsideTouchable
                />
                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('details')} />
                    <Text type="label" style={styles.label} text={t('name')} />
                    <Text text={vm.item?.data.name ?? '-'} />
                    <Text type="label" style={styles.label} text={t('type')} />
                    <Text text={vm.item?.type?.name ?? '-'} />
                </View>
                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('characteristic')} />
                    <Text type="label" style={styles.label} text={vm.item?.data?.size?.width ? t('size') : t('size2')} />
                    <Text text={viewSize(vm.item?.data?.size) ?? '-'} />
                    <Text type="label" style={styles.label} text={t('weight')} />
                    <Text text={vm.item?.data?.chargeWeight || '-'} />
                    <Text type="label" style={styles.label} text={t('fillers')} />
                    {vm.fillers?.map((el, i) => (
                        <View key={i} style={styles.row}>
                            <Touchable onPress={el.explosiveId ? () => onOpenExplosive(el.explosiveId ?? '') : undefined}>
                                <Text
                                    color={el.explosive ? ThemeManager.theme.colors.link : undefined}
                                    text={el.explosive?.displayName ?? el.name ?? '-'}
                                />
                            </Touchable>
                            <Text text={`${el.weight}`} />
                        </View>
                    )) ?? <Text text={'-'} />}
                </View>
                <Block.Slider label={t('purpose')} description={vm.item?.data.purpose?.description} slides={vm.slidesPurpose} />
                <Block.Slider label={t('structure')} description={vm.item?.data.structure?.description} slides={vm.slidesStructure} />
                <Block.Slider label={t('action')} description={vm.item?.data.action?.description} slides={vm.slidesAction} />
            </ScrollView>
        </View>
    );
});
