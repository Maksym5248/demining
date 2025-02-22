import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { Block, CarouselImage, Field } from '~/components';
import { Header, Paragraph, Scroll, Text } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useDevice, useStylesCommon } from '~/styles';
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
            <Header title={vm.item?.data.name} backButton="back" />
            <Scroll contentContainerStyle={styles.scrollViewContent}>
                <CarouselImage width={device.window.width} data={vm.slides} />
                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('details')} />
                    <Field.View label={t('name')} text={vm.item?.data.name} />
                    <Field.View label={t('fullName')} text={vm.item?.data.fullName} />
                    <Field.View label={t('type')} text={vm.item?.type?.displayName} />
                    <Field.View label={t('component')} text={vm.item?.component?.name} />
                    <Field.View label={t('classification')} text={vm.item?.classItemsNames.join(', ')} />
                    <Field.View label={t('country')} text={vm.item?.country?.displayName} />
                    {vm.item?.component?.id === EXPLOSIVE_OBJECT_COMPONENT.AMMO && (
                        <Field.List
                            label={t('fuse')}
                            splitterItem=", "
                            type="horizontal"
                            items={vm.fuses?.map(el => ({
                                title: el?.displayName,
                                onPress: () => vm.openExplosiveObject(el.data.id ?? ''),
                            }))}
                        />
                    )}
                    {vm.item?.component?.id !== EXPLOSIVE_OBJECT_COMPONENT.FERVOR && (
                        <Field.List
                            label={t('fervor')}
                            splitterItem=", "
                            type="horizontal"
                            items={vm.fervor?.map(el => ({
                                title: el?.displayName,
                                onPress: () => vm.openExplosiveObject(el.data.id ?? ''),
                            }))}
                        />
                    )}
                    <Field.View label={t('description')} text={vm.item?.data.description} />
                </View>

                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('characteristic')} />
                    <Field.View label={t('caliber')} text={details?.data.caliber} />
                    <Field.View label={t('material')} text={details?.material?.name} />
                    <Field.View label={details?.data?.size?.width ? t('size') : t('size2')} text={viewSize(details?.data?.size)} />
                    <Field.View label={t('weight')} text={details?.data?.weight} />
                    <Field.List
                        label={t('fillers')}
                        splitter=" - "
                        items={vm.fillers?.map(el => ({
                            title: el.explosive?.displayName ?? el.name ?? '-',
                            text: el.weight,
                            onPress: el.explosiveId ? () => !!el.explosiveId && vm.openExplosive(el.explosiveId) : undefined,
                        }))}
                    />
                    <Field.Range label={t('temperature')} value={[details?.data.temperature?.min, details?.data.temperature?.max]} />
                </View>
                <View style={styles.block}>
                    <Text type="h3" style={styles.label} text={t('fullDescription')} />
                    <Paragraph text={details?.data?.fullDescription ?? '-'} />
                </View>
                <Block.Slider label={t('purpose')} description={details?.data.purpose?.description} data={vm.slidesPurpose} />
                <Block.Slider label={t('structure')} description={details?.data.structure?.description} data={vm.slidesStructure} />
                <Block.Slider label={t('action')} description={details?.data.action?.description} data={vm.slidesAction} />
            </Scroll>
        </View>
    );
});
