import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Section } from '~/components';
import { Header, CarouselImage, List, type IFlatListRenderedItem } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useDevice, useStylesCommon } from '~/styles';

import { Characteristic, Details } from './components';
import { type IListItem, type IExplosiveDeviceDetailsScreenProps } from './explosive-device-details.types';
import { createVM, type IExplosiveObjectDetailsVM } from './explosive-device-details.vm';
import { useStyles } from './explosive-object-details.style';

export const ExplosiveDeviceDetailsScreen = observer(({ route }: IExplosiveDeviceDetailsScreenProps) => {
    const device = useDevice();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-device-details');
    const s = useStyles();

    const vm = useViewModel<IExplosiveObjectDetailsVM>(createVM(route?.params?.id), route?.params);

    const items: IListItem[] = [
        {
            id: 'carousel',
            isVisible: true,
            render: () => <CarouselImage width={device.window.width} data={vm.slides} />,
        },
        {
            id: 'details',
            isVisible: true,
            render: () => <Details item={vm.item} />,
        },
        {
            id: 'characteristic',
            isVisible: true,
            render: () => <Characteristic item={vm.item} characteristic={vm.characteristic} />,
        },
        {
            id: 'marking',
            isVisible: vm.marking.isVisible,
            render: () => <Section.Carousel title={t('marking')} item={vm.marking} />,
        },
        {
            id: 'purpose',
            isVisible: vm.purpose.isVisible,
            render: () => <Section.Carousel title={t('purpose')} item={vm.purpose} />,
        },
        {
            id: 'structure',
            isVisible: vm.structure.isVisible,
            render: () => <Section.Carousel title={t('structure')} item={vm.structure} />,
        },
        {
            id: 'action',
            isVisible: vm.action.isVisible,
            render: () => <Section.Carousel title={t('action')} item={vm.action} />,
        },
    ].filter(item => item.isVisible);

    const renderItem = useCallback(({ item }: IFlatListRenderedItem<IListItem>) => item.render(), []);

    return (
        <View style={styles.container}>
            <Header title={vm.item?.data.name} backButton="back" />
            <List data={items} renderItem={renderItem} contentContainerStyle={[styles.scrollViewContent, s.contentContainer]} />
        </View>
    );
});
