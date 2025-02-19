import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Block, CarouselImage } from '~/components';
import { Header, Text, Touchable, Scroll } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { ThemeManager, useDevice, useStylesCommon } from '~/styles';
import { viewSize } from '~/utils';

import { type IExplosiveDeviceDetailsScreenProps } from './explosive-device-details.types';
import { createVM, type IExplosiveObjectDetailsVM } from './explosive-device-details.vm';

export const ExplosiveDeviceDetailsScreen = observer(({ route }: IExplosiveDeviceDetailsScreenProps) => {
    const device = useDevice();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-device-details');

    const vm = useViewModel<IExplosiveObjectDetailsVM>(createVM(route?.params?.id), route?.params);

    const onOpenExplosive = useCallback((id: string) => {
        vm.openExplosive(id);
    }, []);

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="back" />
            <Scroll contentContainerStyle={styles.scrollViewContent}>
                <CarouselImage width={device.window.width} data={vm.slides} />
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
                        <View key={i} style={[styles.row, styles.marginHorizontalXXS]}>
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
                <Block.Slider label={t('purpose')} description={vm.item?.data.purpose?.description} data={vm.slidesPurpose} />
                <Block.Slider label={t('structure')} description={vm.item?.data.structure?.description} data={vm.slidesStructure} />
                <Block.Slider label={t('action')} description={vm.item?.data.action?.description} data={vm.slidesAction} />
            </Scroll>
        </View>
    );
});
