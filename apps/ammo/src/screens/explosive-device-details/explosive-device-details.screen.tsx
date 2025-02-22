import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Block, CarouselImage, Field } from '~/components';
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
            <Header title={vm.item?.data.name} backButton="back" />
            <Scroll contentContainerStyle={styles.scrollViewContent}>
                <CarouselImage width={device.window.width} data={vm.slides} />
                <Block.View title={t('details')}>
                    <Field.View label={t('name')} text={vm.item?.data.name} />
                    <Field.View label={t('type')} text={vm.item?.type?.name} />
                </Block.View>
                <Block.View title={t('characteristic')}>
                    <Field.View label={t('size')} text={viewSize(vm.item?.data?.size)} />
                    <Field.View label={t('weight')} text={vm.item?.data?.chargeWeight} />
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
                </Block.View>
                <Block.Slider label={t('purpose')} description={vm.item?.data.purpose?.description} data={vm.slidesPurpose} />
                <Block.Slider label={t('structure')} description={vm.item?.data.structure?.description} data={vm.slidesStructure} />
                <Block.Slider label={t('action')} description={vm.item?.data.action?.description} data={vm.slidesAction} />
            </Scroll>
        </View>
    );
});
