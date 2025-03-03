import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { measurement } from 'shared-my';

import { Block, CarouselImage, Field } from '~/components';
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
                <Block.View title={t('details')}>
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
                </Block.View>
                <Block.View title={t('explosiveCharacteristic')}>
                    <Field.Range label={t('detonationSpeed')} value={[velocity?.min, velocity?.max]} />
                    <Field.Range
                        label={t('brisance')}
                        info={t('brisanceTooltip')}
                        value={[
                            brisantness?.min ? measurement.mToMm(brisantness.min) : undefined,
                            brisantness?.max ? measurement.mToMm(brisantness.max) : undefined,
                        ]}
                    />
                    <Field.Range
                        label={t('explosiveVolume')}
                        info={t('explosiveVolumeTooltip')}
                        value={[
                            explosiveness?.min ? measurement.m3ToCm3(explosiveness.min) : undefined,
                            explosiveness?.max ? measurement.m3ToCm3(explosiveness.max) : undefined,
                        ]}
                    />
                    <Field.Range label={t('trotylEquivalent')} value={[tnt?.min, tnt?.max]} />
                    <Field.View label={t('sensitivityToImpact')} text={shock} />
                    <Field.View label={t('sensitivityToTemperature')} text={temperature} />
                    <Field.View label={t('sensitivityToFriction')} text={friction} />
                </Block.View>
                <Block.View title={t('phisicalCharacteristic')}>
                    <Field.Range label={t('density')} value={[density?.min, density?.max]} />
                    <Field.Range label={t('meltingPoint')} value={[meltingPoint?.min, meltingPoint?.max]} />
                    <Field.Range label={t('ignitionPoint')} value={[ignitionPoint?.min, ignitionPoint?.max]} />
                </Block.View>
            </Scroll>
        </View>
    );
});
