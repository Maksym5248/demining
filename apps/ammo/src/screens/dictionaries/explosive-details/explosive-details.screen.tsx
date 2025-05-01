import React, { useCallback } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { Header, CarouselImage, type IFlatListRenderedItem, List } from '~/core';
import { useViewModel } from '~/hooks';
import { useDevice, useStylesCommon } from '~/styles';

import { CharacteristicExplosive, CharacteristicPhisical, Details } from './components';
import { useStyles } from './explosive-details.style';
import { type IExplosiveDetailsScreenProps } from './explosive-details.types';
import { createVM, type IExplosiveDetailsVM } from './explosive-details.vm';
import { type IListItem } from '../explosive-device-details/explosive-device-details.types';

export const ExplosiveDetailsScreen = observer(({ route }: IExplosiveDetailsScreenProps) => {
    const device = useDevice();
    const styles = useStylesCommon();
    const s = useStyles();

    const vm = useViewModel<IExplosiveDetailsVM>(createVM(route?.params?.id), route?.params);
    const items: IListItem[] = [
        {
            id: 'carousel',
            isVisible: true,
            render: () => <CarouselImage width={device.window.width} data={vm.slides} />,
        },
        {
            id: 'details',
            isVisible: true,
            render: () => <Details item={vm.item} details={vm.details} />,
        },
        {
            id: 'characteristicExplosive',
            isVisible: true,
            render: () => <CharacteristicExplosive item={vm.item} />,
        },
        {
            id: 'characteristicPhisical',
            isVisible: true,
            render: () => <CharacteristicPhisical item={vm.item} />,
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
