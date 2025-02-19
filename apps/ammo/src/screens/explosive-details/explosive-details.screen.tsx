import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { measurement } from 'shared-my';

import { CarouselImage } from '~/components';
import { Header, Icon, Text, Tooltip, Touchable, Scroll } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { ThemeManager, useDevice, useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './explosive-details.style';
import { type IExplosiveDetailsScreenProps } from './explosive-details.types';
import { createVM, type IExplosiveDetailsVM } from './explosive-details.vm';

interface IValueProps {
    label: string;
    text?: string | number | null;
    info?: string;
}

const Value = ({ label, text, info }: IValueProps) => {
    const s = useStyles();
    const styles = useStylesCommon();
    const theme = useTheme();

    return (
        <View style={s.item}>
            <View style={s.row}>
                <Text type="label" style={styles.label} text={label} />
                {!!info && (
                    <Tooltip text={info} style={s.iconTooltip}>
                        {<Icon name="info" size={16} color={theme.colors.textSecondary} />}
                    </Tooltip>
                )}
            </View>
            <Text text={text ?? '-'} />
        </View>
    );
};

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
            <Header title={t('title')} backButton="back" />
            <Scroll contentContainerStyle={styles.scrollViewContent}>
                <CarouselImage width={device.window.width} data={vm.slides} />
                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('details')} />
                    <Value label={t('name')} text={vm.item?.data.name} />
                    <Value label={t('fullName')} text={vm.item?.data.fullName} />
                    <Value label={t('formula')} text={vm.item?.data.formula} />
                    <Value label={t('description')} text={vm.item?.data.description} />
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
                    <Value label={t('detonationSpeed')} text={velocity} />
                    <Value
                        label={t('brisance')}
                        info={t('brisanceTooltip')}
                        text={brisantness ? measurement.mToMm(brisantness) : undefined}
                    />
                    <Value
                        label={t('explosiveVolume')}
                        info={t('explosiveVolumeTooltip')}
                        text={explosiveness ? measurement.m3ToCm3(explosiveness) : undefined}
                    />
                    <Value label={t('trotylEquivalent')} text={tnt} />
                    <Value label={t('sensitivityToImpact')} text={shock} />
                    <Value label={t('sensitivityToTemperature')} text={temperature} />
                    <Value label={t('sensitivityToFriction')} text={friction} />
                </View>
                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('phisicalCharacteristic')} />
                    <Value label={t('density')} text={density} />
                    <Value label={t('meltingPoint')} text={meltingPoint} />
                    <Value label={t('ignitionPoint')} text={ignitionPoint} />
                </View>
            </Scroll>
        </View>
    );
});
