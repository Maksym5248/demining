import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Block, CarouselImage } from '~/components';
import { Header, type IFlatListRenderedItem, List, Paragraph } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useDevice, useStylesCommon } from '~/styles';

import { Details } from './components';
import { type IListItem, type IExplosiveObjectDetailsScreenProps } from './explosive-object-details.types';
import { createVM, type IExplosiveObjectDetailsVM } from './explosive-object-details.vm';

export const ExplosiveObjectDetailsScreen = observer(({ route }: IExplosiveObjectDetailsScreenProps) => {
    const device = useDevice();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-object-details');

    const vm = useViewModel<IExplosiveObjectDetailsVM>(createVM(route?.params?.id), route?.params);

    const { details } = vm.item ?? {};

    const items: IListItem[] = [
        {
            id: 'carousel',
            render: () => <CarouselImage width={device.window.width} data={vm.slides} />,
        },
        {
            id: 'details',
            render: () => <Details item={vm.item} />,
        },
        {
            id: 'fullDescription',
            render: () => (
                <Block.View hidden={!details?.data?.fullDescription} title={t('fullDescription')}>
                    <Paragraph text={details?.data?.fullDescription ?? '-'} />
                </Block.View>
            ),
        },
        {
            id: 'historical',
            render: () => (
                <Block.Slider
                    require={false}
                    label={t('historical')}
                    description={details?.data.historical?.description}
                    data={vm.slidesHistorical}
                />
            ),
        },
        {
            id: 'purpose',
            render: () => (
                <Block.Slider
                    require={false}
                    label={t('purpose')}
                    description={details?.data.purpose?.description}
                    data={vm.slidesPurpose}
                />
            ),
        },
        {
            id: 'structure',
            render: () => (
                <Block.Slider
                    require={false}
                    label={t('structure')}
                    description={details?.data.structure?.description}
                    data={vm.slidesStructure}
                />
            ),
        },
        {
            id: 'folding',
            render: () => (
                <Block.Slider
                    require={false}
                    label={t('folding')}
                    description={details?.data.folding?.description}
                    data={vm.slidesFolding}
                />
            ),
        },
        {
            id: 'action',
            render: () => (
                <Block.Slider require={false} label={t('action')} description={details?.data.action?.description} data={vm.slidesAction} />
            ),
        },
        {
            id: 'extraction',
            render: () => (
                <Block.Slider
                    require={false}
                    label={t('extraction')}
                    description={details?.data.extraction?.description}
                    data={vm.slidesExtraction}
                />
            ),
        },
        {
            id: 'liquidator',
            render: () => (
                <Block.Slider
                    require={false}
                    label={t('liquidator')}
                    description={details?.data.liquidator?.description}
                    data={vm.slidesLiquidator}
                />
            ),
        },
        {
            id: 'installation',
            render: () => (
                <Block.Slider
                    require={false}
                    label={t('installation')}
                    description={details?.data.installation?.description}
                    data={vm.slidesInstallation}
                />
            ),
        },
        {
            id: 'neutralization',
            render: () => (
                <Block.Slider
                    require={false}
                    label={t('neutralization')}
                    description={details?.data.neutralization?.description}
                    data={vm.slidesNeutralization}
                />
            ),
        },
        {
            id: 'marking',
            render: () => (
                <Block.Slider
                    require={false}
                    label={t('marking')}
                    description={details?.data.marking?.description}
                    data={vm.slidesMarking}
                />
            ),
        },
    ];

    const renderItem = useCallback(({ item }: IFlatListRenderedItem<IListItem>) => item.render(), []);

    return (
        <View style={styles.container}>
            <Header title={vm.item?.data.name} backButton="back" />
            <List<IListItem> data={items} renderItem={renderItem} contentContainerStyle={styles.scrollViewContent} />
        </View>
    );
});
