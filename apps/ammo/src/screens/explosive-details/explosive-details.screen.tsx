import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { measurement } from 'shared-my';

import { CarouselImage } from '~/components';
import { SCREENS } from '~/constants';
import { Header, Text, Touchable } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { Navigation } from '~/services';
import { ThemeManager, useDevice, useStylesCommon } from '~/styles';

import { type IExplosiveDetailsScreenProps } from './explosive-details.types';
import { createVM, type IExplosiveDetailsVM } from './explosive-details.vm';

export const ExplosiveDetailsScreen = observer(({ route }: IExplosiveDetailsScreenProps) => {
    const device = useDevice();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-details');

    const vm = useViewModel<IExplosiveDetailsVM>(createVM(route?.params?.id), route?.params);

    const onOpenExplosive = useCallback((id: string) => {
        Navigation.push(SCREENS.EXPLOSIVE_DETAILS, { id });
    }, []);

    const { brisantness, velocity, explosiveness, tnt } = vm.item?.data?.explosive ?? {};
    const { shock, temperature, friction } = vm.item?.data?.sensitivity ?? {};
    const { density, meltingPoint, ignitionPoint } = vm.item?.data?.physical ?? {};

    return (
        <View style={styles.container}>
            <Header title={t('title')} backButton="back" />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <CarouselImage width={device.window.width} data={vm.slides} />
                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('details')} />
                    <Text type="label" style={styles.label} text={t('name')} />
                    <Text text={vm.item?.data.name ?? '-'} />
                    <Text type="label" style={styles.label} text={t('fullName')} />
                    <Text text={vm.item?.data.fullName ?? '-'} />
                    <Text type="label" style={styles.label} text={t('formula')} />
                    <Text text={vm.item?.data.formula ?? '-'} />
                    <Text type="label" style={styles.label} text={t('description')} />
                    <Text text={vm.item?.data.description ?? '-'} />
                    <Text type="label" style={styles.label} text={t('composition')} />
                    {vm.composition?.map((el, i) => (
                        <View key={i} style={styles.row}>
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
                    <Text type="label" style={styles.label} text={t('detonationSpeed')} />
                    <Text text={velocity ?? '-'} />
                    <Text type="label" style={styles.label} text={t('brisance')} />
                    <Text text={brisantness ? measurement.mToMm(brisantness) : '-'} />
                    <Text type="label" style={styles.label} text={t('explosiveVolume')} />
                    <Text text={explosiveness ? measurement.m3ToCm3(explosiveness) : '-'} />
                    <Text type="label" style={styles.label} text={t('trotylEquivalent')} />
                    <Text text={tnt ?? '-'} />
                    <Text type="label" style={styles.label} text={t('sensitivityToImpact')} />
                    <Text text={shock ?? '-'} />
                    <Text type="label" style={styles.label} text={t('sensitivityToTemperature')} />
                    <Text text={temperature || '-'} />
                    <Text type="label" style={styles.label} text={t('sensitivityToFriction')} />
                    <Text text={friction ?? '-'} />
                </View>
                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('phisicalCharacteristic')} />
                    <Text type="label" style={styles.label} text={t('density')} />
                    <Text text={density ?? '-'} />
                    <Text type="label" style={styles.label} text={t('meltingPoint')} />
                    <Text text={meltingPoint ?? '-'} />
                    <Text type="label" style={styles.label} text={t('ignitionPoint')} />
                    <Text text={ignitionPoint ?? '-'} />
                </View>
            </ScrollView>
        </View>
    );
});
