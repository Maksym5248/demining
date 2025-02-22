import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { measurement } from 'shared-my';

import { CarouselImage, Field } from '~/components';
import { Header, Text, Touchable, Scroll } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { ThemeManager, useDevice, useStylesCommon } from '~/styles';

import { type IExplosiveDetailsScreenProps } from './explosive-details.types';
import { createVM, type IExplosiveDetailsVM } from './explosive-details.vm';

export const ExplosiveDetailsScreen = observer(({ route }: IExplosiveDetailsScreenProps) => {
    const device = useDevice();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-details');

    const vm = useViewModel<IExplosiveDetailsVM>(createVM(route?.params?.id), route?.params);

    const onOpenExplosive = useCallback((id: string) => {
        vm.openExplosive(id);
    }, []);

    const { brisantness, velocity, explosiveness, tnt } = vm.item?.data?.explosive ?? {};
    const { shock, temperature, friction } = vm.item?.data?.sensitivity ?? {};
    const { density, meltingPoint, ignitionPoint } = vm.item?.data?.physical ?? {};

    return (
        <View style={styles.container}>
            <Header title={vm.item?.data.name} backButton="back" />
            <Scroll contentContainerStyle={styles.scrollViewContent}>
                <CarouselImage width={device.window.width} data={vm.slides} />
                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('details')} />
                    <Field.View label={t('name')} text={vm.item?.data.name} />
                    <Field.View label={t('fullName')} text={vm.item?.data.fullName} />
                    <Field.View label={t('formula')} text={vm.item?.data.formula} />
                    <Field.View label={t('description')} text={vm.item?.data.description} />
                    <Text type="label" style={styles.label} text={t('composition')} />
                    {!vm.composition?.length && <Text text="-" />}
                    {vm.composition?.map((el, i) => (
                        <View key={i} style={[styles.row, styles.marginHorizontalXXS]}>
                            <Touchable onPress={el.explosiveId ? () => onOpenExplosive(el.explosiveId ?? '') : undefined}>
                                <Text
                                    color={el.explosive ? ThemeManager.theme.colors.link : undefined}
                                    text={el.explosive?.displayName ?? el.name ?? '-'}
                                />
                            </Touchable>
                            <Text text={`${el.percent}%`} />
                        </View>
                    ))}
                </View>
                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('explosiveCharacteristic')} />
                    <Field.View label={t('detonationSpeed')} text={velocity} />
                    <Field.View
                        label={t('brisance')}
                        info={t('brisanceTooltip')}
                        text={brisantness ? measurement.mToMm(brisantness) : undefined}
                    />
                    <Field.View
                        label={t('explosiveVolume')}
                        info={t('explosiveVolumeTooltip')}
                        text={explosiveness ? measurement.m3ToCm3(explosiveness) : undefined}
                    />
                    <Field.View label={t('trotylEquivalent')} text={tnt} />
                    <Field.View label={t('sensitivityToImpact')} text={shock} />
                    <Field.View label={t('sensitivityToTemperature')} text={temperature} />
                    <Field.View label={t('sensitivityToFriction')} text={friction} />
                </View>
                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('phisicalCharacteristic')} />
                    <Field.View label={t('density')} text={density} />
                    <Field.View label={t('meltingPoint')} text={meltingPoint} />
                    <Field.View label={t('ignitionPoint')} text={ignitionPoint} />
                </View>
            </Scroll>
        </View>
    );
});
