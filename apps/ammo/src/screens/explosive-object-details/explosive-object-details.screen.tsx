import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { EXPLOSIVE_OBJECT_COMPONENT } from 'shared-my';

import { Block, CarouselImage, Field } from '~/components';
import { Header, Paragraph, Scroll } from '~/core';
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
                <Block.View title={t('details')}>
                    <Field.View label={t('name')} text={vm.item?.data.name} />
                    <Field.View label={t('fullName')} text={vm.item?.data.fullName} require={false} />
                    <Field.View label={t('type')} text={vm.item?.type?.displayName} />
                    <Field.View label={t('component')} text={vm.item?.component?.name} />
                    <Field.View label={t('classification')} text={vm.item?.classItemsNames.join(', ')} />
                    <Field.View label={t('country')} text={vm.item?.country?.displayName} />
                    {vm.item?.component?.id === EXPLOSIVE_OBJECT_COMPONENT.AMMO && (
                        <Field.List
                            label={t('fuse')}
                            splitterItem=", "
                            type="horizontal"
                            require={false}
                            items={vm.fuses?.map(el => ({
                                title: el?.displayName,
                                onPress: () => vm.openExplosiveObject(el.data.id ?? ''),
                            }))}
                        />
                    )}
                    {vm.item?.component?.id !== EXPLOSIVE_OBJECT_COMPONENT.FERVOR && (
                        <Field.List
                            label={t('fervor')}
                            require={false}
                            splitterItem=", "
                            type="horizontal"
                            items={vm.fervor?.map(el => ({
                                title: el?.displayName,
                                onPress: () => vm.openExplosiveObject(el.data.id ?? ''),
                            }))}
                        />
                    )}
                    <Field.View label={t('targetSensor')} text={details?.data.targetSensor} require={false} />
                    <Field.View label={t('sensitivity')} text={details?.data.sensitivity} require={false} />
                    <Field.View label={t('timeWork')} text={details?.data.timeWork} require={false} />
                    <Field.View label={t('description')} text={vm.item?.data.description} require={false} />
                </Block.View>
                <Block.View title={t('characteristic')}>
                    <Field.View label={t('caliber')} text={details?.data.caliber} require={false} />
                    <Field.List
                        label={t('material')}
                        splitterItem=", "
                        type="horizontal"
                        items={details?.materials?.map(el => ({
                            title: el.name,
                        }))}
                    />
                    <Field.List
                        label={t('size')}
                        splitterItem=", "
                        items={
                            details?.data?.size?.map(el => ({
                                title: viewSize(el),
                                text: el.name ? ` (${el.name})` : undefined,
                            })) ?? []
                        }
                        require={false}
                    />
                    <Field.List
                        label={t('weight')}
                        splitterItem=", "
                        type="horizontal"
                        items={details?.data?.weight?.map(el => ({
                            title: el.weight,
                        }))}
                        require={false}
                    />
                    <Field.List
                        label={t('fillers')}
                        splitter=" - "
                        items={vm.fillers
                            ?.sort((a, b) => (a.variant > b.variant ? 1 : -1))
                            .map(el => ({
                                prefix: el.variant ? `${el.variant}) ` : '',
                                title: `${el.explosive?.displayName ?? el.name ?? '-'}`,
                                text: el.weight,
                                onPress: el.explosiveId ? () => !!el.explosiveId && vm.openExplosive(el.explosiveId) : undefined,
                            }))}
                    />
                    <Field.Range
                        label={t('temperature')}
                        value={[details?.data.temperature?.min, details?.data.temperature?.max]}
                        require={false}
                    />
                    {details?.data.additional?.map(el => <Field.View key={el.name} label={el.name} text={el.value} require={false} />)}
                </Block.View>
                <Block.View hidden={!details?.data?.fullDescription} title={t('fullDescription')}>
                    <Paragraph text={details?.data?.fullDescription ?? '-'} />
                </Block.View>
                <Block.Slider
                    require={false}
                    label={t('marking')}
                    description={details?.data.marking?.description}
                    data={vm.slidesMarking}
                />
                <Block.Slider
                    require={false}
                    label={t('purpose')}
                    description={details?.data.purpose?.description}
                    data={vm.slidesPurpose}
                />
                <Block.Slider
                    require={false}
                    label={t('liquidator')}
                    description={details?.data.liquidator?.description}
                    data={vm.slidesLiquidator}
                />
                <Block.Slider
                    require={false}
                    label={t('structure')}
                    description={details?.data.structure?.description}
                    data={vm.slidesStructure}
                />
                <Block.Slider
                    require={false}
                    label={t('folding')}
                    description={details?.data.folding?.description}
                    data={vm.slidesFolding}
                />
                <Block.Slider
                    require={false}
                    label={t('installation')}
                    description={details?.data.installation?.description}
                    data={vm.slidesInstallation}
                />
                <Block.Slider
                    require={false}
                    label={t('extraction')}
                    description={details?.data.extraction?.description}
                    data={vm.slidesExtraction}
                />
                <Block.Slider
                    require={false}
                    label={t('neutralization')}
                    description={details?.data.neutralization?.description}
                    data={vm.slidesNeutralization}
                />
                <Block.Slider require={false} label={t('action')} description={details?.data.action?.description} data={vm.slidesAction} />
            </Scroll>
        </View>
    );
});
