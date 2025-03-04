import React from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Block, CarouselImage, Field } from '~/components';
import { Header, Scroll } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useDevice, useStylesCommon } from '~/styles';
import { viewSize } from '~/utils';

import { type IExplosiveDeviceDetailsScreenProps } from './explosive-device-details.types';
import { createVM, type IExplosiveObjectDetailsVM } from './explosive-device-details.vm';

export const ExplosiveDeviceDetailsScreen = observer(({ route }: IExplosiveDeviceDetailsScreenProps) => {
    const device = useDevice();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-device-details');

    const vm = useViewModel<IExplosiveObjectDetailsVM>(createVM(route?.params?.id), route?.params);

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
                    <Field.List
                        label={t('size')}
                        splitterItem=", "
                        items={
                            vm.item?.data?.size?.map(el => ({
                                title: viewSize(el),
                                text: el.name ? ` (${el.name})` : undefined,
                            })) ?? []
                        }
                        require={false}
                    />
                    <Field.View label={t('weight')} text={vm.item?.data?.chargeWeight} require={false} />
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
                    {vm.item?.data.additional?.map(el => <Field.View key={el.name} label={el.name} text={el.value} require={false} />)}
                </Block.View>
                <Block.Slider
                    require={false}
                    label={t('marking')}
                    description={vm.item?.data?.marking?.description}
                    data={vm.slidesMarking}
                />
                <Block.Slider
                    require={false}
                    label={t('purpose')}
                    description={vm.item?.data.purpose?.description}
                    data={vm.slidesPurpose}
                />
                <Block.Slider
                    require={false}
                    label={t('structure')}
                    description={vm.item?.data.structure?.description}
                    data={vm.slidesStructure}
                />
                <Block.Slider require={false} label={t('action')} description={vm.item?.data.action?.description} data={vm.slidesAction} />
            </Scroll>
        </View>
    );
});
