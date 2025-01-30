import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { EXPLOSIVE_OBJECT_COMPONENT, measurement } from 'shared-my';
import { type ISizeData } from 'shared-my-client';

import { images } from '~/assets';
import { SCREENS } from '~/constants';
import { Carousel, CarouselPagination, Header, type IRenderItemParams, type IRenderFooterParams, Image, Text, Touchable } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { Navigation } from '~/services';
import { ThemeManager, useDevice, useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './explosive-object-details.style';
import { type IExplosiveObjectDetailsScreenProps } from './explosive-object-details.types';
import { createVM, type ISlide, type IExplosiveObjectDetailsVM } from './explosive-object-details.vm';

const getSize = (size?: ISizeData | null) => {
    if (!size) return '-';
    if (size.length && size.height) return `${measurement.mToMm(size.length)}x${measurement.mToMm(size.height)}`;
    if (size.length && size.width && size.height)
        return `${measurement.mToMm(size.length)}x${measurement.mToMm(size.width)}x${measurement.mToMm(size.height)}`;
};

const BlockSlider = ({ description, slides, label }: { description?: string; slides: ISlide[]; label: string }) => {
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

export const ExplosiveObjectDetailsScreen = observer(({ route }: IExplosiveObjectDetailsScreenProps) => {
    const theme = useTheme();
    const device = useDevice();
    const s = useStyles();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-object-details');

    const vm = useViewModel<IExplosiveObjectDetailsVM>(createVM(route?.params?.id), route?.params);

    const onOpenExplosive = useCallback((id: string) => {
        Navigation.push(SCREENS.EXPLOSIVE_DETAILS, { id });
    }, []);

    const onOpenExplosiveObject = useCallback((id: string) => {
        Navigation.push(SCREENS.EXPLOSIVE_OBJECT_DETAILS, { id });
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

    const { details } = vm.item ?? {};

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
                    <Text text={vm.item?.type?.displayName ?? '-'} />
                    <Text type="label" style={styles.label} text={t('component')} />
                    <Text text={vm.item?.component?.name ?? '-'} />
                    <Text type="label" style={styles.label} text={t('classification')} />
                    <Text text={vm.item?.classItemsNames.join(', ') ?? '-'} />
                    <Text type="label" style={styles.label} text={t('country')} />
                    <Text text={vm.item?.country?.displayName ?? '-'} />
                    {vm.item?.component?.id === EXPLOSIVE_OBJECT_COMPONENT.AMMO && (
                        <>
                            <Text type="label" style={styles.label} text={t('fuse')} />
                            {vm.fuses?.length ? (
                                vm.fuses?.map(el => (
                                    <Touchable key={el.id} onPress={() => onOpenExplosiveObject(el.data.id ?? '')}>
                                        <Text color={ThemeManager.theme.colors.link} text={el?.displayName} />
                                    </Touchable>
                                ))
                            ) : (
                                <Text text={'-'} />
                            )}
                        </>
                    )}
                </View>
                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('characteristic')} />
                    <Text type="label" style={styles.label} text={t('caliber')} />
                    <Text text={details?.data.caliber ?? '-'} />
                    <Text type="label" style={styles.label} text={t('material')} />
                    <Text text={details?.material?.name ?? '-'} />
                    <Text type="label" style={styles.label} text={details?.data?.size?.width ? t('size') : t('size2')} />
                    <Text text={getSize(details?.data?.size) ?? '-'} />
                    <Text type="label" style={styles.label} text={t('weight')} />
                    <Text text={details?.data?.weight || '-'} />
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
                    <Text type="label" style={styles.label} text={t('temperature')} />
                    <View style={[styles.row, styles.rowStart]}>
                        <Text text={details?.data.temperature?.max ? `max. ${details?.data.temperature?.max}` : '-'} />
                        <Text text={', '} />
                        <Text text={details?.data.temperature?.min ? `min. ${details?.data.temperature?.min}` : '-'} />
                    </View>
                </View>
                <BlockSlider label={t('purpose')} description={details?.data.purpose?.description} slides={vm.slidesPurpose} />
                <BlockSlider label={t('structure')} description={details?.data.structure?.description} slides={vm.slidesStructure} />
                <BlockSlider label={t('action')} description={details?.data.action?.description} slides={vm.slidesAction} />
            </ScrollView>
        </View>
    );
});
