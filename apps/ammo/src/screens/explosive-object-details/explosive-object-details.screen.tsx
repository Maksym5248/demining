import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { Block, CarouselImage } from '~/components';
import { Header, Scroll, Text, Touchable } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { ThemeManager, useDevice, useStylesCommon } from '~/styles';
import { viewSize } from '~/utils';

import { type IExplosiveObjectDetailsScreenProps } from './explosive-object-details.types';
import { createVM, type IExplosiveObjectDetailsVM } from './explosive-object-details.vm';

export const ExplosiveObjectDetailsScreen = observer(({ route }: IExplosiveObjectDetailsScreenProps) => {
    const device = useDevice();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-object-details');

    const vm = useViewModel<IExplosiveObjectDetailsVM>(createVM(route?.params?.id), route?.params);

    const { details } = vm.item ?? {};

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
                                    <Touchable key={el.id} onPress={() => vm.openExplosiveObject(el.data.id ?? '')}>
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
                    <Text text={viewSize(details?.data?.size) ?? '-'} />
                    <Text type="label" style={styles.label} text={t('weight')} />
                    <Text text={details?.data?.weight || '-'} />
                    <Text type="label" style={styles.label} text={t('fillers')} />
                    {vm.fillers?.map((el, i) => (
                        <View key={i} style={[styles.row, styles.marginHorizontalXXS]}>
                            <Touchable onPress={el.explosiveId ? () => vm.openExplosive(el.explosiveId ?? '') : undefined}>
                                <Text
                                    color={el.explosive ? ThemeManager.theme.colors.link : undefined}
                                    text={el.explosive?.displayName ?? el.name ?? '-'}
                                />
                            </Touchable>
                            <Text text={`${el.weight}`} />
                        </View>
                    )) ?? <Text text={'-'} />}
                    <Text type="label" style={styles.label} text={t('temperature')} />
                    <View style={[styles.row, styles.start, styles.marginHorizontalXXS]}>
                        <Text text={details?.data.temperature?.max ? `max. ${details?.data.temperature?.max}` : '-'} />
                        <Text text={', '} />
                        <Text text={details?.data.temperature?.min ? `min. ${details?.data.temperature?.min}` : '-'} />
                    </View>
                </View>
                <Block.Slider label={t('purpose')} description={details?.data.purpose?.description} data={vm.slidesPurpose} />
                <Block.Slider label={t('structure')} description={details?.data.structure?.description} data={vm.slidesStructure} />
                <Block.Slider label={t('action')} description={details?.data.action?.description} data={vm.slidesAction} />
            </Scroll>
        </View>
    );
});
